< !DOCTYPE html >
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Form</title>
    <style>
        .hidden {
            display: none;
        }

        .active {
            font-weight: bold;
            border: solid;
            border-color: #EA5D0F;
            background-color: #EA5D0F;
            color: white;
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        input[type=number] {
            -moz-appearance: textfield;
        }
    </style>
    @vite('resources/css/app.css')
</head>

<body class=" min-h-screen ">

    <div class="container mx-auto items-center">


        <div class="m-10 flex flex-col gap-5 text-center">
            <p class="lg:text-5xl md:text-3xl text-2xl text-[#EA5D0F] font-bold">

                ADMISSION FORM
            </p>
            <p class="text-gray-600">
                Please fill in the form below to apply for admission. All fields marked with an asterisk (*) are mandatory.
            </p>



        </div>

        <div class="shadow-xl p-24 rounded-2xl    border-t-2 lg:block hidden">
            <form method="POST" action={{ route( 'form.store') }} enctype="multipart/form-data">
                @csrf

                <div id="form-page-1" class=" space-y-8">
                    <div class=" space-y-5">

                        <h1 class="font-semibold text-xl underline underline-offset-8">Student Details</h1>
                        <!-- <p class="text-red-600 pl-1 mt-3 italic mb-5"> * indicates mandatory field</p> -->
                        <div class="">

                            <label for="doc" class="cursor-pointer">
                                <div class="flex flex-col">
                                    <div id="preview" class="h-48 w-48 flex justify-center items-center flex-row gap-3 border-2 border-dashed bg-[#F4F4F4] border-[#EA5D0F] rounded-md">
                                        <p id="upload-text" class="font-bold text-lg text-[#717171]">Upload Image</p>

                                        <img id="img" src="{{ old('image') ? asset('storage/' . old('image')) : asset('assets/icons/upload.svg') }}" alt="Image Preview" class="rounded-md object-cover" />
                                    </div>
                                    <p id="" class=" text-sm text-[#717171] block">(Type must be of .png, jpeg, or jpg & of 2MB)
                                    </p>
                                    <input type="file" name="image" id="doc" value="{{ old('image') }}" hidden />
                                </div>
                            </label>


                            @if ($errors->has('image'))
                            <div class="text-red-500">{{ $errors->first('image') }}</div>
                            @endif
                        </div>

                        <div class="flex w-full *:grow gap-4 mb-10">
                            <div>
                                <label>
                                    First Name
                                    <x-asterisk></x-asterisk>
                                </label>
                                <input type="text" name="first_name" class="input" value="{{ old('first_name') }}" /> @if ($errors->has('first_name'))
                                <div class="text-red-500">{{ $errors->first('first_name') }}</div>
                                @endif
                            </div>
                            <div>
                                <label>
                                    Middle Name
                                    <x-asterisk></x-asterisk>
                                </label>
                                <input type="text" name="middle_name" class="input" value="{{ old('middle_name') }}" /> @if ($errors->has('middle_name'))
                                <div class="text-red-500">{{ $errors->first('middle_name') }}</div>
                                @endif
                            </div>

                            <div>
                                <label>
                                    Last Name
                                    <x-asterisk></x-asterisk>
                                </label>
                                <input type="text" name="last_name" class="input" value="{{ old('last_name') }}" /> @if ($errors->has('last_name'))
                                <div class="text-red-500">{{ $errors->first('last_name') }}</div>
                                @endif
                            </div>

                        </div>

                    </div>

                    <div class=" space-y-5">

                        <h2 class="font-semibold text-xl underline underline-offset-8 mb-6">Home Address</h2>

                        <div class="grid grid-cols-3 gap-4">

                            <div>
                                <label>Province
                                    <x-asterisk></x-asterisk>
                                    </p>
                                </label>
                                <select name="province" class="input" id="province">
                                    <option value="" disabled {{ old( 'province') ? '' : 'selected' }}>Select your province
                                    </option>
                                    @foreach ($provinces as $province)
                                    <option value="{{ $province }}" {{ old( 'province')==$ province ? 'selected' : '' }}>
                                        {{ $province }}
                                    </option>
                                    @endforeach
                                </select>
                                @if ($errors->has('province'))
                                <div class="text-red-500">{{ $errors->first('province') }}</div>
                                @endif
                            </div>

                            <div>
                                <label>District
                                    <x-asterisk></x-asterisk>
                                    </p>
                                </label>
                                <input type="text" name="district" class="input" id="district" value="{{ old('district') }}" /> @if ($errors->has('district'))
                                <div class="text-red-500">{{ $errors->first('district') }}</div>
                                @endif
                            </div>

                            <div>
                                <label>Town
                                    <x-asterisk></x-asterisk>
                                    </p>
                                </label>
                                <input type="text" name="town" class="input" id="town" value="{{ old('town') }}" /> @if ($errors->has('town'))
                                <div class="text-red-500">{{ $errors->first('town') }}</div>
                                @endif
                            </div>

                        </div>


                    </div>


                    <div class=" space-y-5">


                        <h2 class="font-semibold text-xl underline underline-offset-8 mb-6">Academic Details</h2>

                        <div class="grid grid-cols-3 gap-4">

                            <div>
                                <label>Name of Current School
                                    <x-asterisk></x-asterisk>
                                </label>
                                <input type="text" name="current_school" class="input" value="{{ old('current_school') }}" /> @if ($errors->has('current_school'))
                                <div class="text-red-500">{{ $errors->first('current_school') }}</div>
                                @endif
                            </div>


                            <div>
                                <label>Language Used at Home</label>
                                <input type="text" name="home_language" placeholder="Optional" class="input" value="{{ old('home_language') }}" /> @if ($errors->has('home_language'))
                                <div class="text-red-500">{{ $errors->first('home_language') }}</div>
                                @endif
                            </div>


                            <div>
                                <label>EMIS Number</label>
                                <input type="number" name="emis_no" class="input" value="{{ old('emis_no') }}" placeholder="Optional" /> @if ($errors->has('emis_no'))
                                <div class="text-red-500">{{ $errors->first('emis_no') }}</div>
                                @endif
                            </div>


                            <div>
                                <label>Currently Passed Grade
                                    <x-asterisk></x-asterisk>
                                    </p>
                                </label>
                                <input type="string" name="passed_grade" class="input" value="{{ old('passed_grade') }}" /> @if ($errors->has('passed_grade'))
                                <div class="text-red-500">{{ $errors->first('passed_grade') }}</div>
                                @endif
                            </div>
                            <div>
                                <label>Grade Applied
                                    <x-asterisk></x-asterisk>
                                </label>
                                <input type="string" name="grade_applied" class="input" value="{{ old('grade_applied') }}" /> @if ($errors->has('grade_applied'))
                                <div class="text-red-500">{{ $errors->first('grade_applied') }}</div>
                                @endif
                            </div>
                            <div>
                                <label>GPA
                                    <x-asterisk></x-asterisk>
                                </label>
                                <input type="number" name="gpa" placeholder="Final Grade Before Leaving Previous School" class="border border-black w-full px-3 py-2" value="{{ old('gpa') }}" /> @if ($errors->has('gpa'))
                                <div class="text-red-500">{{ $errors->first('gpa') }}</div>
                                @endif
                            </div>
                        </div>
                    </div>
                    <div class=" space-y-5">
                        <h2 class="font-semibold text-xl underline underline-offset-8">Health Details</h2>
                        <div class=" mb-10">
                            <div class="flex  items-center gap-2">
                                <input type="checkbox" class="h-4 w-4 " id="physical_condition" name="physical_condition" value="1" {{ (!empty(old( 'physical_condition')) ? 'checked' : '') }}>
                                <label class="mt-2" for="physical_condition">I have physical condition/chronic disease
                                </label>
                            </div>
                            <div class="flex items-center gap-2">
                                <input type="checkbox" class="h-4 w-4 " name="allergy" id="allergy" value="1" {{ (!empty(old( 'allergy')) ? 'checked' : '') }}>
                                <label class="mt-2" for="allergy">I have some kind of allergy</label>
                            </div>
                            <div class="flex items-center gap-2">
                                <input type="checkbox" class="h-4 w-4 " name="special_assistance" value="1" {{ (!empty(old( 'special_assistance')) ? 'checked' : '') }} id="special_assistance">
                                <label class="mt-2" for="special_assistance">I require special kind of special_assistance in class for my disability
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="form-page-2" class=" space-y-8">
                    <div class=" space-y-5">

                        <h1 class="font-semibold text-xl underline underline-offset-8">Parent's Details</h1>
                        <div class="w-full mb-10">

                            <label>Father's / Mother's Name
                                <x-asterisk></x-asterisk>
                            </label>
                            <input type="text" name="parent_name" class="input" value="{{ old('parent_name') }}" /> @if ($errors->has('parent_name'))
                            <div class="text-red-500">{{ $errors->first('parent_name') }}</div>
                            @endif

                        </div>
                    </div>


                    <div class=" space-y-5">

                        <h2 class="font-semibold text-xl underline underline-offset-8">Address Details</h2>
                        <div class="flex gap-5 w-full *:grow mb-10">

                            <div>
                                <label>Province
                                    <x-asterisk></x-asterisk>
                                </label>

                                <select name="province_parent" class="input" id="province_parent">
                                    <option value=" " disabled selected>Select your province</option>
                                    @foreach ($provinces as $province)
                                    <option value="{{ $province }}" {{ old( 'province_parent')==$ province ? 'selected' : '' }}>
                                        {{ $province }}
                                    </option>
                                    @endforeach
                                </select>
                                @if ($errors->has('province_parent'))
                                <div class="text-red-500">{{ $errors->first('province_parent') }}</div>
                                @endif
                            </div>

                            <div>
                                <label>District
                                    <x-asterisk></x-asterisk>
                                </label>
                                <input type="text" name="district_parent" class="input" id="district_parent" value="{{ old('district_parent') }}" /> @if ($errors->has('district_parent'))
                                <div class="text-red-500">{{ $errors->first('district_parent') }}</div>
                                @endif
                            </div>

                            <div>
                                <label>Town
                                    <x-asterisk></x-asterisk>
                                </label>
                                <input type="text" name="town_parent" class="input" id="town_parent" value="{{ old('town_parent') }}" /> @if ($errors->has('town_parent'))
                                <div class="text-red-500">{{ $errors->first('town_parent') }}</div>
                                @endif
                            </div>
                        </div>
                    </div>


                    <div class=" space-y-5">

                        <h2 class="font-semibold text-xl underline underline-offset-8 mb-6">Contact Details</h2>

                        <div class="flex gap-5 *:grow w-full mb-10">
                            <div>
                                <label>Contact
                                    <x-asterisk></x-asterisk>
                                </label>
                                <input type="text" name="contact_parent" class="input" value="{{ old('contact_parent') }}" /> @if ($errors->has('contact_parent'))
                                <div class="text-red-500">{{ $errors->first('contact_parent') }}</div>
                                @endif
                            </div>
                            <div>
                                <label>Email Address
                                    <x-asterisk></x-asterisk>
                                </label>
                                <input type="email" name="email_parent" class="input" value="{{ old('email_parent') }}" /> @if ($errors->has('email_parent'))
                                <div class="text-red-500">{{ $errors->first('email_parent') }}</div>
                                @endif
                            </div>
                        </div>
                    </div>


                    <div class=" space-y-5">

                        <h2 class="font-semibold text-xl underline underline-offset-8">Academic and Professional
                            Details</h2>
                        <div class="flex gap-5 w-full *:grow mb-10 ">
                            <div>
                                <label>Academic Qualification</label>
                                <input type="text" name="academic_qualification_parent" placeholder="Optional" class="input" value="{{ old('academic_qualification_parent') }}" /> @if ($errors->has('academic_qualification_parent'))
                                <div class="text-red-500">{{ $errors->first('academic_qualification_parent') }}</div>
                                @endif
                            </div>
                            <div>
                                <label>Profession</label>
                                <input type="text" name="profession_parent" placeholder="Optional" class="input" value="{{ old('profession_parent') }}" /> @if ($errors->has('profession_parent'))
                                <div class="text-red-500">{{ $errors->first('profession_parent') }}</div>
                                @endif
                            </div>
                        </div>

                    </div>

                </div>

                <div id="form-page-3" class="bg-red-400 space-y-8">
                    <div class=" space-y-5">

                        <h1 class="font-semibold text-xl underline underline-offset-8">Guardian's Details(Optional)
                        </h1>
                        <div class="mb-10">
                            <label>Local Guardian's Name (If The Child Is With Guardian)</label>
                            <input type="text" name="guardian_name" class="input" value="{{ old('guardian_name') }}" /> @if ($errors->has('guardian_name'))
                            <div class="text-red-500">{{ $errors->first('guardian_name') }}</div>
                            @endif
                        </div>
                    </div>

                    <div class=" space-y-5">

                        <h2 class="font-semibold text-lg underline underline-offset-8">Permanent Address</h2>
                        <div class="flex gap-5 *:grow mb-10">
                            <div>
                                <label>Province</label>
                                <select name="province_guardian" class="input" id="province_guardian">
                                    <option value=" " disabled selected>Select your province</option>
                                    @foreach ($provinces as $province)
                                    <option value="{{ $province }}" {{ old( 'province_guardian')==$ province ? 'selected' : '' }}>
                                        {{ $province }}
                                    </option>
                                    @endforeach
                                </select>
                            </div>
                            <div>
                                <label>District</label>
                                <input type="text" name="district_guardian" id="district_guardian" class="input" value="{{ old('district_guardian') }}" />
                            </div>
                            <div>
                                <label>Town</label>
                                <input type="text" name="town_guardian" id="town_guardian" class="input" value="{{ old('town_guardian') }}" />
                            </div>
                        </div>
                    </div>

                    <div class=" space-y-5">


                        <h2 class="font-semibold text-lg underline underline-offset-8 mb-6">Contact No.</h2>

                        <div class="grid grid-cols-2 grid-rows-2 gap-5 *:grow mb-6">
                            <div>
                                <label>Mobile</label>
                                <input type="text" name="contact_guardian" class="input" value="{{ old('contact_guardian') }}" /> @if ($errors->has('contact_guardian'))
                                <div class="text-red-500">{{ $errors->first('contact_guardian') }}</div>
                                @endif
                            </div>
                            <div>
                                <label>Email Address</label>
                                <input type="email" name="email_guardian" class="input" value="{{ old('email_guardian') }}" /> @if ($errors->has('email_guardian'))
                                <div class="text-red-500">{{ $errors->first('email_guardian') }}</div>
                                @endif
                            </div>
                            <div>
                                <label>Academic Qualification</label>
                                <input type="text" name="academic_qualification_guardian" class="input" value="{{ old('academic_qualification_guardian') }}" /> @if ($errors->has('academic_qualification_guardian'))
                                <div class="text-red-500">{{ $errors->first('academic_qualification_guardian') }}
                                </div>
                                @endif
                            </div>
                            <div>
                                <label>Profession</label>
                                <input type="text" name="profession_guardian" class="input" value="{{ old('profession_guardian') }}" /> @if ($errors->has('profession_guardian'))
                                <div class="text-red-500">{{ $errors->first('profession_guardian') }}</div>
                                @endif
                            </div>
                        </div>

                    </div>

                    <div class="mt-8 flex justify-end">
                        <button type="submit" class="text-white cursor-pointer font-semibold  hover:bg-orange-500 bg-[#EA5D0F] p-2 w-32 rounded-lg ">Submit</button>
                    </div>

                </div >

            </form >
        </div >
    </div >

</body >
    <script>
        const inpFile = document.getElementById('doc');
        const previewContainer = document.getElementById('preview');
        const previewImage = document.getElementById('img');
        const uploadText = document.getElementById('upload-text');

        inpFile.addEventListener('change', function() {
        const file = this.files[0];

        if (file) {
            const reader = new FileReader();

        reader.addEventListener('load', function() {
            previewImage.setAttribute('src', this.result);
        previewImage.classList.remove('hidden');
        uploadText.classList.add('hidden');
            });

        reader.readAsDataURL(file);
        } else {
            previewImage.classList.add('hidden');
        previewImage.setAttribute('src', '');
        uploadText.classList.remove('hidden');
        }
    });
    </script>

</html >