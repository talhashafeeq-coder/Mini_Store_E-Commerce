import React from 'react';
import '../Style/Banner.css';
import IndexUrl from '../hooks/IndexUrl';

export default function Banner() {
  return (
    <>
      <IndexUrl.CheckUserlogin />
      <section className="hero-banner d-flex align-items-center">
        <div className="overlay"></div>

        <div className="container text-center text-white hero-content">
          <p className="small-tagline">Timeless Elegance</p>
          <h1 className="hero-heading animate__animated animate__fadeInDown">
            Discover the 2025 <br /> Signature Jewellery Line
          </h1>
          <p className="hero-subtext animate__animated animate__fadeInUp animate__delay-1s">
            Crafted to perfection with ethically sourced materials and elegant designs.
          </p>
          <div className="hero-buttons mt-4 animate__animated animate__fadeInUp animate__delay-2s">
            <button className="btn btn-light btn-lg me-3 shadow">Shop Now</button>
            <button className="btn btn-outline-light btn-lg shadow">Explore Collection</button>
          </div>

          {/* Optional floating badge */}
          <div className="promo-badge">New 2025 Collection</div>
        </div>
      </section>
    </>
  );
}
