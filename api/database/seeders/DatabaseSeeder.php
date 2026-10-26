<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (app()->environment('production')) {
            $this->command->info('DatabaseSeeder skipped in production.');

            return;
        }

        $this->command->info('Resetting seeded data...');

        User::query()->delete();
        Category::query()->delete();
        Tag::query()->delete();
        Comment::query()->delete();
        Post::query()->delete();

        $primaryUser = User::updateOrCreate(
            ['email' => 'admin@dojo.com'],
            [
                'name' => 'Dojo Admin',
                'username' => 'dojo_admin',
                'password' => Hash::make('testPass'),
            ]
        );

        $users = User::factory()
            ->count(2)
            ->create()
            ->push($primaryUser);

        $this->command->info('Seeding categories, tags and posts...');

        $categoryNames = [
            'Programming',
            'Web Development',
            'Software Engineering',
            'Computer Science',
            'Artificial Intelligence',
            'Data Science',
            'Cybersecurity',
            'Cloud Computing',
            'DevOps',
            'Hardware and Systems',
        ];
        $categories = collect($categoryNames)->map(
            fn (string $name): Category => Category::query()->create([
                'name' => $name,
                'slug' => Str::slug($name),
            ])
        );
        $tags = Tag::factory()->count(6)->create();

        $posts = Post::factory()
            ->count(10)
            ->for(User::factory()->recycle($users), 'author')
            ->for(Category::factory()->recycle($categories))
            ->create();

        $this->command->info('Attaching comments, tags and likes...');

        $posts->each(function (Post $post) use ($users, $tags) {
            Comment::factory()
                ->count(fake()->numberBetween(0, 2))
                ->for($post)
                ->for(User::factory()->recycle($users))
                ->create();

            $post->tags()->attach(
                $tags->random(fake()->numberBetween(1, 3))->pluck('id')
            );
        });

        $users->each(function (User $user) use ($posts) {
            $user->likedPosts()->attach(
                $posts->random(3)->pluck('id')->unique()
            );
        });

        $this->command->info('Seeding finished.');
    }
}
