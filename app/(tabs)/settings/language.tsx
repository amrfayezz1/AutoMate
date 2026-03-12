import React from "react";
import { View, Text, Pressable } from "react-native";
import { useUIStore } from "../../../stores/uiStore";
import i18n from "../../../lib/i18n";

export default function LanguageScreen() {
  const { language, setLanguage } = useUIStore();

  function select(lang: "en" | "ar") {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  }

  return (
    <View className="flex-1 bg-slate-950 px-4 pt-14">
      <Text className="mb-8 text-2xl font-bold text-slate-100">
        Language & Theme
      </Text>

      <Text className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-500">
        Language
      </Text>
      <View className="rounded-xl border border-slate-600 bg-slate-800 overflow-hidden">
        {(["en", "ar"] as const).map((lang, i) => (
          <Pressable
            key={lang}
            onPress={() => select(lang)}
            className={`flex-row items-center justify-between px-4 py-4 ${
              language === lang ? "bg-amber-400/10" : ""
            } active:bg-slate-700/50`}
          >
            <Text className="text-base text-slate-100">
              {lang === "en" ? "English" : "العربية"}
            </Text>
            {language === lang ? (
              <Text className="text-amber-400">✓</Text>
            ) : null}
          </Pressable>
        ))}
      </View>

      <Text className="mt-6 text-xs text-slate-500">
        Theme: Dark mode only in MVP. Light mode coming later.
      </Text>
    </View>
  );
}
