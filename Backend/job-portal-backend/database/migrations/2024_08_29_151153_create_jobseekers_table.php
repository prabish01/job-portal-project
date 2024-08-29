<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jobseekers', function (Blueprint $table) {
            $table->id();
  
            $table->text('image')->nullable();
            $table->string('name');
            $table->string('email')->index();
            $table->string('password');
            $table->string('mobile');
            $table->date('dob')->nullable();
            $table->string('gender')->nullable();
            $table->string('current_address');
            $table->string('permanent_address');
            $table->string('linkedin_url')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('otp')->nullable();
            $table->string('otp_expires_at')->nullable();
            $table->string('token')->nullable();
            $table->string('verification_code')->nullable();
            $table->rememberToken();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobseekers');
    }
};
