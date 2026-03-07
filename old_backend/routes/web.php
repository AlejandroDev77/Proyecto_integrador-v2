<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TestMailController;




Route::get('/send-test', [TestMailController::class, 'testMail']);