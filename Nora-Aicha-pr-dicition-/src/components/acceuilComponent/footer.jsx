import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto px-4">
                <div className="row text-center">
                    <div className="col-lg-12">
                        <p className="text-sm">
                            Copyright © 2048 <a href="#" className="text-blue-400 hover:text-blue-500">SnapX</a> Photo Contest Co., Ltd. All rights reserved. 
                            <br />
                            Design: <a
                                title="CSS Templates"
                                rel="sponsored"
                                href="https://templatemo.com/page/1"
                                target="_blank"
                                className="text-blue-400 hover:text-blue-500"
                            >
                                TemplateMo
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
