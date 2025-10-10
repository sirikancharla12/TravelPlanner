// src/components/BackgroundImage.js

import * as React from 'react';

export default function BackgroundImage() {
    return (
        <div>
            {/* These classes make the image a fixed, full-screen background */}
            <img 
                src="/bg.png" 
                alt="Background"
                className="fixed inset-0 w-full h-full object-cover -z-10" 
            />
        </div>
    );
}