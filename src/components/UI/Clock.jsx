import React, { useState, useEffect } from "react";
import "../../styles/clock.css";
const Clock = () => {
  const [days, setDays] = useState();
  const [hours, setHours] = useState();
  const [minutes, setMinutes] = useState();
  const [seconds, setSeconds] = useState();

  let interval;

  const countDown = () => {
    // Thay đổi thành ngày tương lai (31/12/2025)
    const destination = new Date("December 31, 2025").getTime();
    interval = setInterval(() => {
      const now = new Date().getTime();
      const different = destination - now;

      // Xử lý trường hợp countdown đã hết
      if (different <= 0) {
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        clearInterval(interval);
        return;
      }

      const days = Math.floor(different / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (different % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((different % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((different % (1000 * 60)) / 1000);

      setDays(days);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);
    });
  };

  useEffect(() => {
    countDown();
  });

  return (
    <div className="clock__wrapper d-flex align-items-center gap-3">
      <div className="clock__data d-flex align-items-center gap-3">
        <div className="text-center">
          <h1 className="text-white fs-3 mb-2">{days} </h1>
          <h5 className="text-white fs-6">Ngày</h5>
        </div>
        <span className="text-white fs-3 mb-2">:</span>
      </div>

      <div className="clock__data d-flex align-items-center gap-3">
        <div className="text-center">
          <h1 className="text-white fs-3 mb-2">{hours} </h1>
          <h5 className="text-white fs-6">Giờ</h5>
        </div>
        <span className="text-white fs-3 mb-2">:</span>
      </div>
      <div className="clock__data d-flex align-items-center gap-3">
        <div className="text-center">
          <h1 className="text-white fs-3 mb-2">{minutes} </h1>
          <h5 className="text-white fs-6">Phút</h5>
        </div>
        <span className="text-white fs-3 mb-2">:</span>
      </div>
      <div className="clock__data d-flex align-items-center gap-3">
        <div className="text-center">
          <h1 className="text-white fs-3 mb-2">{seconds} </h1>
          <h5 className="text-white fs-6">Giây</h5>
        </div>
      </div>
    </div>
  );
};

export default Clock;
