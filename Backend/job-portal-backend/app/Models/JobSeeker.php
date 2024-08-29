<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticate;
use Illuminate\Contracts\Auth\CanResetPassword;



class JobSeeker extends Authenticate implements CanResetPassword
{
    use HasApiTokens,HasFactory,Authenticatable,Notifiable;

    protected $table = 'jobseekers';

    protected $fillable = [
        'name',
        'email',
        'password',
        'mobile',
        'dob',
        'gender',
        'current_address',
        'permanent_address',
        'linkedin_url'
    ];
}
