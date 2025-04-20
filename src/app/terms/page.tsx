import ThemeToggle from "@/components/ThemeToggle";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const TermsOfServicePage = () => {
    return (
        <div className="max-w-7xl mx-auto py-12 px-8">
            <div className="flex flex-row justify-end p-5">
                <ThemeToggle />
            </div>
            <div className="max-w-5xl px-8 mx-auto sm:mt-10">
                <h1 className="text-center text-3xl sm:text-6xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Terms and Conditions
                </h1>
                <h2 className="text-center text-gray-600 dark:text-gray-300 mb-20">
                    Last updated April 21st, 2025
                </h2>
                <h3 className="text-left text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-5">
                    1. Introduction
                </h3>
                <p className="text-justify leading-relaxed text-gray-600 dark:text-gray-300 mt-5 mb-10">
                    By using Swift Mail you confirm your acceptance of, and agree to be bound by, these terms and conditions.
                </p>
                <h3 className="text-left text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-5">
                    2. Agreement to Terms and Conditions
                </h3>
                <p className="text-justify leading-relaxed text-gray-600 dark:text-gray-300 mt-5 mb-10">
                    This Agreement takes effect on the date on which you first use the Swift Mail application.
                </p>
                <h3 className="text-left text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-5">
                    3. Unlimited Access Software License with Termination Rights
                </h3>
                <p className="text-justify leading-relaxed text-gray-600 dark:text-gray-300 mt-5 mb-10">
                    The Swift Mail Software License facilitates the acquisition of Swift Mail software through a single purchase, granting users unrestricted and perpetual access to its comprehensive functionalities. Tailored for independent creators, entrepreneurs, and small businesses, Swift Mail empowers users to create compelling web pages and online portfolios.
                    This license entails a straightforward and flexible arrangement, exempting users from recurring fees or subscriptions. However, it is important to acknowledge that the licensor retains the right to terminate the license without conditions or prerequisites. This termination provision enables the licensor to exercise control over software distribution and utilization.
                    Opting for the Swift Mail Software License enables users to enjoy the benefits of the software while recognizing the licensor&apos;s unrestricted termination rights, which provide adaptability and address potential unforeseen circumstances.
                </p>
                <h3 className="text-left text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-5">
                    4. Disclaimer
                </h3>
                <p className="text-justify leading-relaxed text-gray-600 dark:text-gray-300 mt-5 mb-10">
                    It is not warranted that Swift Mail will meet your requirements or that its operation will be uninterrupted or error free. All express and implied warranties or conditions not stated in this Agreement (including without limitation, loss of profits, loss or corruption of data, business interruption or loss of contracts), so far as such exclusion or disclaimer is permitted under the applicable law are excluded and expressly disclaimed. This Agreement does not affect your statutory rights.
                </p>
                <h3 className="text-left text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-5">
                    6. Warranties and Limitation of Liability
                </h3>
                <p className="text-justify leading-relaxed text-gray-600 dark:text-gray-300 mt-5 mb-10">
                Swift Mail does not give any warranty, guarantee or other term as to the quality, fitness for purpose or otherwise of the software. Swift Mail shall not be liable to you by reason of any representation (unless fraudulent), or any implied warranty, condition or other term, or any duty at common law, for any loss of profit or any indirect, special or consequential loss, damage, costs, expenses or other claims (whether caused by Swift Mail&apos;s negligence or the negligence of its servants or agents or otherwise) which arise out of or in connection with the provision of any goods or services by Swift Mail. Swift Mail shall not be liable or deemed to be in breach of contract by reason of any delay in performing, or failure to perform, any of its obligations if the delay or failure was due to any cause beyond its reasonable control. Notwithstanding contrary clauses in this Agreement, in the event that Swift Mail are deemed liable to you for breach of this Agreement, you agree that Swift Mail&apos;s liability is limited to the amount actually paid by you for your services or software, which amount calculated in reliance upon this clause. You hereby release Swift Mail from any and all obligations, liabilities and claims in excess of this limitation.
                </p>
                <h3 className="text-left text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-5">
                    7. Responsibilities
                </h3>
                <p className="text-justify leading-relaxed text-gray-600 dark:text-gray-300 mt-5 mb-10">
                    Swift Mail is not responsible for what the user does with the user-generated content.
                </p>
                <h3 className="text-left text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-5">
                    9. General Terms and Law
                </h3>
                <p className="text-justify leading-relaxed text-gray-600 dark:text-gray-300 mt-5 mb-10">
                    This Agreement is governed by the laws of India. You acknowledge that no joint venture, partnership, employment, or agency relationship exists between you and Swift Mail as a result of your use of these services. You agree not to hold yourself out as a representative, agent or employee of Swift Mail. You agree that Swift Mail will not be liable by reason of any representation, act or omission to act by you.
                </p>
            </div>
            <div className="flex flex-row justify-center p-5">
                <Link href="/">
                    <Button>
                        <ArrowLeft className="size-5" />
                        Back
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default TermsOfServicePage;