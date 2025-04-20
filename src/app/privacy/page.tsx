import ThemeToggle from '@/components/ThemeToggle';
import React from 'react';

const PrivacyPolicyPage = () => {
    return (
        <div className='max-w-7xl mx-auto py-12 px-8'>
            <div className="flex flex-row justify-end p-5">
                <ThemeToggle />
            </div>
            <div className="max-w-5xl px-8 mx-auto sm:mt-10">
                <h1 className="text-center text-3xl sm:text-6xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Privacy Policy
                </h1>
                <h2 className="text-center text-gray-600 dark:text-gray-300 mb-20">
                    Last updated April 21st 2025
                </h2>
                <h3 className="text-left text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-5">
                    Introduction
                </h3>
                <p className="text-justify leading-relaxed text-gray-600 dark:text-gray-300 mt-5 mb-10">
                    Swift Mail (“Swift Mail,” “we,” “us,” or “our”) we value your privacy and are committed to protecting
                    and processing your personal information responsibly. This Privacy Statement describes how we collect, use, and
                    share the personal information described in this Privacy Statement, as well as the rights and choices individuals have
                    regarding such personal information. We may provide additional data privacy information by using a supplementary
                    privacy notice.
                </p>
                <h3 className="text-left text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-5">
                    Personal Information We Collect and Use
                </h3>
                <p className="text-justify leading-relaxed text-gray-600 dark:text-gray-300 mt-5 mb-10">
                    This section describes the various types of information that is collect and how we use it. It includes information on:
                    <ol>
                        <li>Our applications</li>
                        <li>Support Services</li>
                        <li>Cookies and related technologies</li>
                        <li>Children</li>
                    </ol>
                </p>
                <h3 className="text-left text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-5">
                    Our Website
                </h3>
                <p className="text-justify leading-relaxed text-gray-600 dark:text-gray-300 mt-5 mb-10">
                    Our website offers ways to communicate with you about us, our products, and services. The
                    information that we collect on websites is used to provide you with access to the website, to operate the website, to
                    improve your experience, and to personalize the way that information is provided to you.
                </p>
                <h3 className="text-left text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-5">
                    Cookies and related technologies
                </h3>
                <p className="text-justify leading-relaxed text-gray-600 dark:text-gray-300 mt-5 mb-10">
                    When you visit our website, our applications, or view our content on certain
                    third-party websites, we collect information regarding your connection and your activity by using various online
                    tracking technologies, such as cookies. Information that is collected with these technologies may be necessary to
                    operate the website or service, to improve performance, to help us understand how our online services are used, or to
                    determine the interests of our users. 
                </p>
                <h3 className="text-left text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-5">
                    Sharing Personal Information
                </h3>
                <p className="text-justify leading-relaxed text-gray-600 dark:text-gray-300 mt-5 mb-10">
                    We may share your personal information internally and externally with suppliers, advisors, or Business Partners for
                    Normal Human’s legitimate business purposes, and only on a need-to-know basis. When sharing personal information,
                    we implement appropriate checks and controls to confirm that the information can be shared in accordance with the
                    applicable law. This section describes how we share information and how we facilitate that sharing.
                </p>
                <h3 className="text-left text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-5">
                    Information Security and Retention
                </h3>
                <p className="text-justify leading-relaxed text-gray-600 dark:text-gray-300 mt-5">
                    To protect your personal information from unauthorized access, use, and disclosure, we implement reasonable
                    physical, administrative, and technical safeguards. These safeguards include role-based access controls and
                    encryption to keep personal information private while in transit. We only retain personal information as long as
                    necessary to fulfill the purposes for which it is processed, or to comply with legal and regulatory retention
                    requirements. Legal and regulatory retention requirements may include retaining information for:
                </p>
                <ul className="list-disc list-inside text-justify leading-relaxed text-gray-600 dark:text-gray-300 mb-10">
                    <li>audit and accounting purposes,</li>
                    <li>statutory retention terms,</li>
                    <li>the handling of disputes,</li>
                    <li>and the establishment, exercise, or defense of legal claims in the countries where we do business.</li>
                </ul>
                <h3 className="text-left text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-5">
                    Your Rights
                </h3>
                <p className="text-justify leading-relaxed text-gray-600 dark:text-gray-300 mt-5">
                    The below are the rights you have as an user of out application when it comes to the handling of personal information for which you can reach out to us for further clarifications.
                </p>
                <ul className="list-disc list-inside text-justify leading-relaxed text-gray-600 dark:text-gray-300 mb-10">
                    <li>request access to the personal information that we have on you, or have it updated or corrected. Depending
                        on the applicable law, you may have additional rights concerning your personal information.</li>
                    <li>request to obtain your personal information in a usable format and transmit it to another party (also known
                        as the right to data portability).</li>
                    <li>request to delete the personal information we hold information processing types, such as targeted advertising.</li>
                    <li>ask questions related to this Privacy Statement and privacy practices.</li>
                    <li>submit a complaint to Normal Human if you are not satisfied with how we are processing your personal
                        information.</li>
                </ul>
                <h3 className="text-left text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-5">
                    Privacy Statement Updates
                </h3>
                <p className="text-justify leading-relaxed text-gray-600 dark:text-gray-300 mt-5 mb-10">
                    If a material change is made to this Privacy Statement, the effective date is revised, and a notice is posted on the
                    updated Privacy Statement for 30 days. By continuing to use our websites and services after a revision takes effect,
                    it is considered that users have read and understand the changes.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;