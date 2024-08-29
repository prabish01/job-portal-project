<?php

use App\Http\Controllers\JobSeekerApi\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('jobseeker/register',[UserController::class,'register']);
Route::post('jobseeker/login',[UserController::class,'login']);


Route::group(['middleware' => 'auth:jobseeker_api'], function () {
    Route::prefix('jobseeker')->group(function(){
        Route::post('logout',[UserController::class,'logout']);
    });
});