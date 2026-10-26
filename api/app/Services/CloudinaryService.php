<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * @phpstan-type CloudinaryUploadResult array{public_id: string, url: string}
 * @phpstan-type Credentials array{cloud_name: string, api_key: string, api_secret: string}
 */
class CloudinaryService
{
    /** @var Credentials */
    private array $credentials;

    public function __construct()
    {
        $this->credentials = $this->parseCredentialUrl(config('services.cloudinary.url'));
    }

    /**
     * Upload an image file and return its Cloudinary identifiers.
     *
     * @return CloudinaryUploadResult
     *
     * @throws ConnectionException|RequestException
     */
    public function upload(UploadedFile $file): array
    {
        $timestamp = time();
        $parameters = ['timestamp' => $timestamp];
        $folder = config('services.cloudinary.upload_folder');

        if (is_string($folder) && trim($folder) !== '') {
            $parameters['folder'] = $folder;
        }

        $signature = $this->sign($parameters);
        $parameters['api_key'] = $this->credentials['api_key'];
        $parameters['signature'] = $signature;

        $response = Http::throw()
            ->attach('file', $file->getContent(), $file->getClientOriginalName())
            ->post($this->endpoint('/image/upload'), $parameters);

        $payload = $response->json();

        return [
            'public_id' => (string) $payload['public_id'],
            'url' => (string) $payload['secure_url'],
        ];
    }

    /**
     * Destroy an asset by its public ID. Destroying a missing asset is a no-op.
     *
     * @throws ConnectionException|RequestException
     */
    public function destroy(string $publicId): void
    {
        $timestamp = time();
        $signature = $this->sign(['public_id' => $publicId, 'timestamp' => $timestamp]);

        Http::throw()->asForm()->post($this->endpoint('/image/destroy'), [
            'public_id' => $publicId,
            'api_key' => $this->credentials['api_key'],
            'timestamp' => $timestamp,
            'signature' => $signature,
        ]);
    }

    /**
     * Build an Upload API endpoint URL for the configured cloud.
     */
    private function endpoint(string $path): string
    {
        return 'https://api.cloudinary.com/v1_1/'.$this->credentials['cloud_name'].$path;
    }

    /**
     * Compute the SHA-1 Cloudinary signature for the given parameters.
     *
     * @param  array<string, string|int>  $parameters
     */
    private function sign(array $parameters): string
    {
        ksort($parameters);

        $toSign = collect($parameters)
            ->map(fn (string|int $value, string $key): string => $key.'='.$value)
            ->implode('&');

        return sha1($toSign.$this->credentials['api_secret']);
    }

    /**
     * Parse a CLOUDINARY_URL credential string (cloudinary://<key>:<secret>@<cloud_name>).
     */
    private function parseCredentialUrl(?string $url): array
    {
        $parts = parse_url($url ?? '');

        if (! $parts || empty($parts['host']) || empty($parts['user']) || empty($parts['pass'])) {
            throw new RuntimeException('CLOUDINARY_URL is not configured or is invalid');
        }

        return [
            'cloud_name' => (string) $parts['host'],
            'api_key' => (string) $parts['user'],
            'api_secret' => (string) $parts['pass'],
        ];
    }
}
