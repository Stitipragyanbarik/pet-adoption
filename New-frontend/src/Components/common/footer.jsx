import React from 'react';
import './footer.css'

function Footer(){
    return (
        <footer className="footer">
            <div className="footer-content" id="about-section">
                <h2>About PetRescue</h2>
                <p>
                  PetRescue is dedicated to helping animals find loving homes, providing rescue
                  services, and supporting responsible pet care.
                </p>
                <p>&copy; {new Date().getFullYear()} PetRescue. All rights reserved.</p>
                <p>
                    <a href="/privacy" className="">Privacy Policy</a> | 
                    <a href="/terms" className=""> Terms of Service</a>
                </p>
                <p><a href="/address" className=''>Address</a></p>
            </div>
        </footer>
    );
};

export default Footer;