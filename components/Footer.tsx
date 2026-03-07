import React, { useState } from 'react';
import Modal from './Modal';

const Footer: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', content: <></> });

    const handleLinkClick = (type: 'privacy' | 'terms' | 'contact') => {
        let title = '';
        let content = <></>;

        switch (type) {
            case 'privacy':
                title = 'Privacy Policy';
                content = (
                    <div className="space-y-3 text-sm text-neutral-600 dark:text-base-300">
                        <p>This Privacy Policy outlines how DormSync, managed by M kumarasamy college of Engineering, collects, uses, and protects your personal information.</p>
                        <h4 className="font-bold text-neutral-800 dark:text-white">Information We Collect:</h4>
                        <ul className="list-disc list-inside pl-2">
                            <li><strong>Personal Identification Information:</strong> Name, Student ID, Room Number.</li>
                            <li><strong>Contact Information:</strong> Email address and phone number provided in your profile.</li>
                            <li><strong>Usage Data:</strong> Service requests, outing requests, and interaction logs within the app.</li>
                        </ul>
                        <h4 className="font-bold text-neutral-800 dark:text-white">How We Use Your Information:</h4>
                        <p>Your data is used solely for the purpose of managing hostel operations, improving our services, ensuring student safety, and communicating important notices.</p>
                        <p>We are committed to ensuring that your information is secure and will not be shared with third parties without your consent, except as required by law.</p>
                    </div>
                );
                break;
            case 'terms':
                title = 'Terms of Service';
                content = (
                     <div className="space-y-3 text-sm text-neutral-600 dark:text-base-300">
                        <p>By using the DormSync platform, you agree to comply with the following terms and conditions set by M kumarasamy college of Engineering.</p>
                        <h4 className="font-bold text-neutral-800 dark:text-white">User Responsibilities:</h4>
                        <ul className="list-disc list-inside pl-2">
                            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                            <li>All information provided, including service and outing requests, must be accurate and truthful.</li>
                            <li>The platform must not be used for any unlawful or prohibited activities.</li>
                            <li>Users must adhere to all hostel rules and regulations as outlined by the college administration.</li>
                        </ul>
                        <h4 className="font-bold text-neutral-800 dark:text-white">Disclaimer:</h4>
                        <p>The service is provided on an "as is" basis. The administration will make best efforts to ensure timely responses but does not guarantee immediate resolution for all requests.</p>
                    </div>
                );
                break;
            case 'contact':
                title = 'Contact Us';
                content = (
                    <div className="space-y-3 text-sm text-neutral-600 dark:text-base-300">
                         <p>For any queries, support, or emergencies, please contact the hostel administration at M kumarasamy college of Engineering.</p>
                         <ul className="space-y-2">
                            <li><strong>Address:</strong> Thalavapalayam, Karur, Tamil Nadu 639113, India.</li>
                            <li><strong>Hostel Office Phone:</strong> +91-4295-226000 (Ext. 6181)</li>
                            <li><strong>Support Email:</strong> support.dormsync@mkce.ac.in</li>
                         </ul>
                    </div>
                );
                break;
        }

        setModalContent({ title, content });
        setIsModalOpen(true);
    };

    return (
        <>
            <footer className="bg-base-200 dark:bg-neutral-800/50 border-t border-base-300 dark:border-neutral-700/50 p-4 text-center text-sm text-neutral-500 dark:text-base-400">
                <div className="container mx-auto">
                    <p>&copy; {new Date().getFullYear()} DormSync Management System. All rights reserved.</p>
                    <div className="mt-2 space-x-4">
                        <button onClick={() => handleLinkClick('privacy')} className="hover:text-secondary">Privacy Policy</button>
                        <span>|</span>
                        <button onClick={() => handleLinkClick('terms')} className="hover:text-secondary">Terms of Service</button>
                        <span>|</span>
                        <button onClick={() => handleLinkClick('contact')} className="hover:text-secondary">Contact Us</button>
                    </div>
                </div>
            </footer>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalContent.title}>
                {modalContent.content}
            </Modal>
        </>
    );
};

export default Footer;