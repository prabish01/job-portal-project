import React from "react";
import { Facebook, Instagram, Linkedin, Youtube, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
export default function Footer() {
  return (
    <>
      <footer className="bg-gray-50 py-12">
        <div className="container max-w-8xl">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-2">JP</div>
                <div>
                  <h2 className="text-xl font-bold text-blue-800">JOB Portal</h2>
                  <p className="text-sm text-gray-600">DREAM JOB</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Job Portal, a premier, legally certified Human Resource consulting firm since 2014, operates with unwavering ethics, prioritizing client value. This commitment resonates as it navigates the professional landscape, addressing both Job Vacancies in Nepal and the specific dynamics of
                Jobs in Kathmandu.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-blue-800">For Employers</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Vacancy Annoucements
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Outsourcing Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Recruitment Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Human Resource Consulting
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-blue-800">For Jobseekers</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Search Jobs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Browse By Categories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Read Careertips
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Jobseeker Account
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-blue-800">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Trainings
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Report A Problem
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-blue-800">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Blogs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Terms And Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Sitemap
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 mb-4 md:mb-0">© 2024 | Job Portal PD. TL.</p>
            <div className="flex space-x-4">
              <p className="text-sm text-gray-600 mr-4">Connect with us:</p>
              <a href="#" className="text-gray-600 hover:text-blue-500">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-500">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-500">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-500">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-500">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
