import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router";
import { Img } from "./Img";

export interface ServiceSlide {
  title: string;
  text: string;
  to: string;
}

/** Carrossel de serviços do template (mesma marcação e as mesmas opções do main.js: loop, centralizado, autoplay, 3/2/1 slides). */
export function ServiceSlider({ slides }: { slides: ServiceSlide[] }) {
  return (
    <Swiper
      className="service-wrapslide"
      modules={[Autoplay, Pagination]}
      spaceBetween={0}
      speed={1300}
      loop
      centeredSlides
      roundLengths
      autoplay={{ delay: 2000, disableOnInteraction: false }}
      pagination={{ el: ".dot-cmn", clickable: true }}
      breakpoints={{ 0: { slidesPerView: 1 }, 575: { slidesPerView: 2 }, 767: { slidesPerView: 2 }, 1199: { slidesPerView: 3 }, 1299: { slidesPerView: 3 } }}
    >
      {slides.map((s) => (
        <SwiperSlide key={s.title}>
          <div className="program-item gap-3 d-grid justify-content-start">
            <div className="icon">
              <Img src="aicon/car-icons1.webp" alt="" />
            </div>
            <div className="content">
              <h4 className="mb-xxl-3 mb-2">
                <Link to={s.to}>{s.title}</Link>
              </h4>
              <p className="mb-xxl-3 mb-2">{s.text}</p>
              <Link to={s.to} className="readmore d-flex align-items-center gap-2">
                Saiba mais
                <span className="arrows mt-1">
                  <i className="fa-solid fa-arrow-right p4-clr"></i>
                </span>
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
