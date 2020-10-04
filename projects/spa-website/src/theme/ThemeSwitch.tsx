import React, { useMemo } from "react";
import { DeepDarkFantasy } from "./DeepDarkFantasy";
import { useMount } from "@/hook/useMount";
import { message, Switch } from "antd";
import "./themeSwitch.css";
import { useLocalStorageState } from "@/hook/useLocalStorageState";

// eslint-disable-next-line no-shadow
enum Theme {
  dark = "dark",
  light = "light",
}
interface ThemeSwitchProps {
  defaultTheme?: Theme;
}

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({
  defaultTheme = Theme.light,
}) => {
  const [t, setTheme] = useLocalStorageState<Theme>("theme", defaultTheme);
  const theme: Theme = t && t in Theme ? t : Theme.light;

  function handleChangeTheme(newTheme: Theme) {
    setTheme(newTheme);
  }

  useMount(() => {
    const preferDarkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    //检测暗色模式
    if (preferDarkQuery.matches) {
      setTheme(Theme.dark);
    }
    const darkListener = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setTheme(Theme.dark);
      }
    };
    preferDarkQuery.addEventListener("change", darkListener);

    const preferLightQuery = window.matchMedia("(prefers-color-scheme: light)");
    const lightListener = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setTheme(Theme.light);
      }
    };
    preferLightQuery.addEventListener("change", lightListener);

    return () => {
      preferDarkQuery.removeEventListener("change", darkListener);
      preferLightQuery.removeEventListener("change", lightListener);
    };
  });

  useMount(() => {
    if (theme === Theme.dark) {
      message.info("已启用暗黑主题.");
    }
  });

  return (
    <>
      <ThemeSwitchButton
        currentTheme={theme}
        onChangeTheme={handleChangeTheme}
      />
      {theme === Theme.dark && <DeepDarkFantasy />}
    </>
  );
};

const ThemeSwitchButton: React.FC<{
  currentTheme: Theme;
  onChangeTheme: (theme: Theme) => void;
}> = ({ currentTheme, onChangeTheme }) => {
  const clz = useMemo(() => {
    const array = ["theme-switch-button"];
    if (currentTheme === Theme.dark) {
      array.push("dark");
    } else if (currentTheme === Theme.light) {
      array.push("light");
    }
    return array.join(" ");
  }, [currentTheme]);

  return (
    <div className={clz}>
      <Switch
        checked={currentTheme === Theme.dark}
        onClick={(checked) => {
          onChangeTheme(checked ? Theme.dark : Theme.light);
        }}
        checkedChildren={
          <img src="/img/night.png" alt="" className="theme-switch-img" />
        }
        unCheckedChildren={
          <img src="/img/day.png" alt="" className="theme-switch-img" />
        }
      />
    </div>
  );
};
