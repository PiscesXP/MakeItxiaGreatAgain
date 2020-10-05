import React, { useEffect, useRef } from "react";
import "./backTop.css";

// eslint-disable-next-line no-shadow
enum BackTopStatus {
  fadeIn,
  show,
  fadeOut,
  hide,
}

function easeInCubic(x: number): number {
  return x * x * x;
}

/**
 * 返回顶部组件.
 * */
export const BackTop: React.FC<{
  visibilityHeight?: number;
}> = ({ visibilityHeight = 400 }) => {
  const ref = useRef<any>();

  useEffect(() => {
    let previousScrollTop = document.documentElement.scrollTop;
    let status: BackTopStatus =
      previousScrollTop > visibilityHeight
        ? BackTopStatus.show
        : BackTopStatus.hide;

    if (status === BackTopStatus.show) {
      ref.current.id = "show";
    } else {
      ref.current.id = "hide";
    }

    function listener() {
      const { scrollTop } = document.documentElement;
      const diff = scrollTop - previousScrollTop;
      if (diff > 0) {
        //向下滚动
        if (status === BackTopStatus.hide && scrollTop > visibilityHeight) {
          //淡入
          status = BackTopStatus.fadeIn;
          ref.current.id = "fade-in";
          //500ms后完全显示
          setTimeout(() => {
            status = BackTopStatus.show;
            ref.current.id = "show";
          }, 0);
        }
      } else {
        //向上滚动
        if (status === BackTopStatus.show && scrollTop < visibilityHeight) {
          //淡出
          status = BackTopStatus.fadeOut;
          ref.current.id = "fade-out";

          //500ms后完全隐藏
          setTimeout(() => {
            status = BackTopStatus.hide;
            ref.current.id = "hide";
          }, 1000);
        }
      }
      //记录为上次的高度
      previousScrollTop = scrollTop;
    }
    window.addEventListener("scroll", listener, true);
    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, [visibilityHeight]);

  function handleBackTop(event: any) {
    event.preventDefault();
    const { scrollTop: totalHeight, clientHeight } = document.documentElement;
    const maxTime = 1000;
    let beginTime: number;

    ref.current.style.transition = "bottom 0s ease-in";
    function moveTop(time: number) {
      if (beginTime === undefined) {
        beginTime = time;
      }
      const timeElapsedPercent = (time - beginTime) / maxTime;
      if (timeElapsedPercent > 0.99) {
        document.documentElement.scrollTop = 0;

        ref.current.style.bottom = null;
        ref.current.style.transition = null;
        ref.current.style.opacity = null;
      } else {
        const restHeightPercent = 1 - easeInCubic(timeElapsedPercent);
        document.documentElement.scrollTop = restHeightPercent * totalHeight;

        ref.current.style.bottom = `${timeElapsedPercent * clientHeight}px`;
        ref.current.style.opacity = (restHeightPercent * 2) / 3;
        requestAnimationFrame(moveTop);
      }
    }

    requestAnimationFrame(moveTop);
  }

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a ref={ref} className="itxia-back-top" onClick={handleBackTop}>
      <div>
        <img
          className="itxia-back-top-img"
          src={"/img/backtop-min.png"}
          alt="itxia-backTop"
        />
        <span className="back-top-text">返回顶部</span>
      </div>
    </a>
  );
};
