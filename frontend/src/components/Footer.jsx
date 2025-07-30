import React from 'react'

const Footer = () => {
  return (
    <div>
      <div className=" text-[#737373] bg-[#0e0701]  inset-0 bg-gradient-to-b from-[#392211] via-transparent to-transparent md:px-10 mt-10 ">
        <div className="py-6 text-2xl">
            <p>Developed by Vansh Babbar</p>
        </div>
        <p className="pb-2">Questions? Contact us.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 text-sm pb-10 max-w-5xl">
            <ul className="flex flex-col space-y-2">
            <li>FAQ</li>
            <li>Investor Relations</li>
            <li>Privacy</li>
            <li>Speed Test</li>
            </ul>

            <ul className="flex flex-col space-y-2">
            <li>Help Center</li>
            <li>Jobs</li>
            <li>Cookie Preferences</li>
            <li>Legal Notices</li>
            </ul>

            <ul className="flex flex-col space-y-2">
            <li>Account</li>
            <li>Ways to Watch</li>
            <li>Corporate Information</li>
            <li>Only on Netflix</li>
            </ul>

            <ul className="flex flex-col space-y-2">
            <li>Media Center</li>
            <li>Terms of Use</li>
            <li>Contact Us</li>
            </ul>
        </div>
      </div>
    </div>
  )
}

export default Footer
