import React, { lazy, Suspense } from "react";
import '../Style/card.css'
import IndexUrl from "../hooks/IndexUrl";
import Footer from "./Footer";


// Lazy Load Components
const SlowComponent = lazy(() => import('../components/DisplayProject'));
const SlowBannerCard = lazy(() => import('../pages/BannerCard'));

const Products = () => { 
    return (
        <>
            <IndexUrl.Navbar />
            <IndexUrl.Banner />
            
            {/* Suspense wrapper for SlowComponent */}
            <Suspense fallback={<div>Loading...</div>}>
                <SlowComponent />
            </Suspense>
            <Footer />

            {/* Suspense wrapper for SlowBannerCard (Fixed Syntax Error) */}
            {/* <Suspense fallback={<div>Loading ... Card</div>}>
                <SlowBannerCard />
            </Suspense> */}
        </>
    );
};

export default Products;
