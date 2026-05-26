import { useState, useEffect, useRef } from "react";

const BUTTONS_DISABLED = true;

const buggyMessages = [
  "Ошибка 404: корзина не найдена",
  "Сервер временно недоступен. Попробуйте через 3-5 рабочих лет",
  "Ошибка оплаты: карта отклонена вселенной",
  "Произошла непредвиденная ошибка #NaN",
  "Заказ принят! Нет, не принят. Не знаем.",
  "Пожалуйста, отключите блокировщик рекламы, включите, снова отключите",
  "Ваш заказ обрабатывается... обрабатывается... обрабатывается...",
  "Ошибка: товар есть в меню, но его нет. Парадокс.",
];

function glitchText(text: string): string {
  const glitchChars = ["З", "Ж", "Ф", "Ъ", "Э", "Ё", "▓", "█", "▒"];
  if (Math.random() > 0.7) {
    const pos = Math.floor(Math.random() * text.length);
    return text.slice(0, pos) + glitchChars[Math.floor(Math.random() * glitchChars.length)] + text.slice(pos + 1);
  }
  return text;
}

export default function Index() {
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [logoText, setLogoText] = useState("VINYL*DINER");
  const [priceMultiplier, setPriceMultiplier] = useState(1);
  const [shakeBtn, setShakeBtn] = useState<string | null>(null);
  const [skewAmount, setSkewAmount] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [buttonLabels, setButtonLabels] = useState({
    order: "Заказать",
    menu: "Смотреть меню",
    book: "Забронировать",
    story: "Наша история",
    card1: "В корзину",
    card2: "В корзину",
    card3: "В корзину",
  });
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmStep, setConfirmStep] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setLogoText(glitchText("VINYL*DINER"));
      setSkewAmount((Math.random() - 0.5) * 4);
      setOverlayOpacity(Math.random() * 0.06);
      setPriceMultiplier(0.5 + Math.random() * 3);
    }, 800);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollOffset(window.scrollY * 0.3);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function showBugError(id?: string) {
    const msg = buggyMessages[Math.floor(Math.random() * buggyMessages.length)];
    setErrorMsg(msg);
    setShowError(true);
    if (id) {
      setShakeBtn(id);
      setTimeout(() => setShakeBtn(null), 600);
    }
    setTimeout(() => setShowError(false), 3000);
  }

  function handleOrder() {
    setCartCount((c) => c + 1);
    setConfirmVisible(true);
    setConfirmStep(0);
  }

  function handleConfirmStep() {
    if (confirmStep < 3) {
      setConfirmStep((s) => s + 1);
    } else {
      setCartCount(0);
      setConfirmVisible(false);
      showBugError("order");
    }
  }

  function handleAddToCart(item: "card1" | "card2" | "card3") {
    setButtonLabels((prev) => ({ ...prev, [item]: "Добавляю..." }));
    setTimeout(() => {
      setButtonLabels((prev) => ({ ...prev, [item]: "✓ Добавлено!" }));
      setCartCount((c) => c + 1);
      setTimeout(() => {
        setCartCount(0);
        setButtonLabels((prev) => ({ ...prev, [item]: "Ошибка. Снова?" }));
        showBugError(item);
        setTimeout(() => {
          setButtonLabels((prev) => ({ ...prev, [item]: "В корзину" }));
        }, 2000);
      }, 1200);
    }, 1500);
  }

  const prices = {
    p1: Math.round(1400 * priceMultiplier),
    p2: Math.round(1800 * priceMultiplier),
    p3: Math.round(1200 * priceMultiplier),
  };

  return (
    <>
      <div className="grain-overlay" />
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: `rgba(255,0,0,${overlayOpacity})`, pointerEvents: "none", zIndex: 9999 }} />

      {showError && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 99999,
          background: "#ff4d00", color: "white", padding: "16px 20px",
          border: "3px solid #1a1a1a", boxShadow: "6px 6px 0 #1a1a1a",
          maxWidth: 320, fontWeight: 700, fontSize: 14,
          animation: "shake 0.4s ease",
        }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {confirmVisible && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.7)", zIndex: 50000,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "white", border: "3px solid #1a1a1a",
            boxShadow: "10px 10px 0 #1a1a1a", padding: 40, maxWidth: 380,
            textAlign: "center", transform: `rotate(${skewAmount}deg)`,
          }}>
            {confirmStep === 0 && <>
              <h3 style={{ fontFamily: "Unbounded", fontSize: 20, marginBottom: 16 }}>Вы уверены?</h3>
              <p style={{ marginBottom: 20, color: "#555" }}>Хотите добавить блюдо в корзину?</p>
              <button className="btn-cta" onClick={handleConfirmStep}>Да</button>
            </>}
            {confirmStep === 1 && <>
              <h3 style={{ fontFamily: "Unbounded", fontSize: 20, marginBottom: 16 }}>Точно уверены?</h3>
              <p style={{ marginBottom: 20, color: "#555" }}>Это необратимое действие. Подтвердите ещё раз.</p>
              <button className="btn-cta" onClick={handleConfirmStep}>Подтвердить</button>
            </>}
            {confirmStep === 2 && <>
              <h3 style={{ fontFamily: "Unbounded", fontSize: 20, marginBottom: 16 }}>Введите капчу</h3>
              <p style={{ marginBottom: 12, color: "#555" }}>Докажите что вы не робот</p>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/320px-Camponotus_flavomarginatus_ant.jpg" alt="captcha" style={{ width: "100%", marginBottom: 12, border: "2px solid #ccc", filter: "blur(2px) contrast(150%)" }} />
              <p style={{ fontSize: 12, color: "#999", marginBottom: 16 }}>Нажмите все светофоры (их нет)</p>
              <button className="btn-cta" onClick={handleConfirmStep} style={{ background: "#bff000" }}>Я не робот (наверное)</button>
            </>}
            {confirmStep === 3 && <>
              <h3 style={{ fontFamily: "Unbounded", fontSize: 20, marginBottom: 16 }}>Почти готово!</h3>
              <p style={{ marginBottom: 20, color: "#555" }}>Осталось подтвердить по SMS, email, через приложение и лично у директора.</p>
              <button className="btn-cta" onClick={handleConfirmStep} style={{ background: "#ff4d00", color: "white" }}>Отмена — всё сброшено</button>
            </>}
          </div>
        </div>
      )}

      <header className="header" style={{ transform: `skewX(${skewAmount * 0.3}deg)` }}>
        <div className="logo" style={{ letterSpacing: -2, filter: `blur(${Math.abs(skewAmount) * 0.1}px)` }}>
          {logoText}
        </div>
        <nav>
          <a href="#" onClick={(e) => { e.preventDefault(); showBugError(); }}>Меню</a>
          <a href="#" onClick={(e) => { e.preventDefault(); showBugError(); }}>О нас</a>
          <a href="#" onClick={(e) => { e.preventDefault(); showBugError(); }}>Афиша</a>
          <a href="#" onClick={(e) => { e.preventDefault(); showBugError(); }}>Адреса</a>
        </nav>
        <button
          className="btn-cta"
          id="book"
          disabled={BUTTONS_DISABLED}
          style={{
            transform: shakeBtn === "book" ? "translateX(8px)" : "none",
            position: "relative",
            opacity: 0.4,
            cursor: "not-allowed",
            filter: "grayscale(80%)",
          }}
          onClick={() => showBugError("book")}
        >
          {buttonLabels.book}
          {cartCount > 0 && (
            <span style={{
              position: "absolute", top: -8, right: -8,
              background: "#ff4d00", color: "white",
              borderRadius: "50%", width: 20, height: 20,
              fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800,
            }}>{cartCount > 9 ? "?" : cartCount}</span>
          )}
        </button>
      </header>

      <main>
        <section className="hero" style={{ transform: `translateY(${scrollOffset * 0.05}px)` }}>
          <div className="hero-content">
            <h1 className="hero-title" style={{ transform: `skewY(${skewAmount * 0.5}deg)` }}>
              БЕЗ ПОНТОВ,
              <br />
              ТОЛЬКО <span>ВКУС</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl mb-8 md:mb-10 leading-relaxed text-[#555]">
              Эстетика 70-х в современной подаче. Локальные продукты, огненные блюда и атмосфера для настоящих ценителей.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <button
                className="btn-cta"
                disabled={BUTTONS_DISABLED}
                style={{
                  background: "var(--primary)", color: "white",
                  transform: shakeBtn === "order" ? "translate(10px, -10px) rotate(5deg)" : "none",
                  transition: "transform 0.1s",
                  opacity: 0.4, cursor: "not-allowed", filter: "grayscale(80%)",
                }}
                onClick={handleOrder}
              >
                {buttonLabels.order}
              </button>
              <button
                className="btn-cta"
                disabled={BUTTONS_DISABLED}
                style={{
                  background: "white",
                  transform: shakeBtn === "menu" ? "translateX(-15px)" : "none",
                  opacity: 0.4, cursor: "not-allowed", filter: "grayscale(80%)",
                }}
                onClick={() => showBugError("menu")}
              >
                {buttonLabels.menu}
              </button>
            </div>
            <p style={{ fontSize: 10, color: "#bbb", marginTop: 8 }}>
              * Цены меняются каждые 0.8 секунды. Мы не знаем почему.
            </p>
          </div>
          <div className="hero-img">
            <div className="sticker" style={{ transform: `rotate(${15 + skewAmount * 3}deg)` }}>
              СВЕЖАК
              <br />
              КАЖДЫЙ ДЕНЬ
            </div>
            <div className="floating-tag hidden md:block" style={{ top: "20%", left: "10%", transform: `translateY(${scrollOffset * 0.1}px)` }}>
              #ЭСТЕТИКА
            </div>
            <div className="floating-tag hidden md:block" style={{ bottom: "30%", right: "20%", transform: `translateY(${-scrollOffset * 0.15}px)` }}>
              ОГОНЬ
            </div>
          </div>
        </section>

        <div className="marquee">
          <div className="marquee-content" style={{ animationDuration: `${Math.max(5, 20 - Math.abs(skewAmount) * 3)}s` }}>
            &nbsp; * БУРГЕРЫ КОТОРЫЕ РВУТ * КРАФТОВЫЕ КОКТЕЙЛИ * ТОЛЬКО РЕТРО ВАЙБ * ОТКРЫТЫ ДО 2:00 * ЛУЧШИЕ В ГОРОДЕ *
            БУРГЕРЫ КОТОРЫЕ РВУТ * КРАФТОВЫЕ КОКТЕЙЛИ * ТОЛЬКО РЕТРО ВАЙБ * ОТКРЫТЫ ДО 2:00 * ЛУЧШИЕ В ГОРОДЕ
          </div>
        </div>

        <section className="section-padding">
          <div className="section-header">
            <h2 className="section-title">ВЫБОР ШЕФА</h2>
            <a
              href="#"
              className="text-sm md:text-base"
              style={{ color: "var(--dark)", fontWeight: 800, textTransform: "uppercase" }}
              onClick={(e) => { e.preventDefault(); showBugError(); }}
            >
              Всё меню
            </a>
          </div>

          <div className="menu-grid">
            <div className="menu-card" style={{ transform: `rotate(${skewAmount * 0.3}deg)` }}>
              <span className="menu-tag">Хит продаж</span>
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Классический бургер"
                style={{ filter: `hue-rotate(${Math.abs(skewAmount) * 10}deg)` }}
              />
              <div className="menu-card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <h3>Классика</h3>
                  <span className="price" style={{ color: prices.p1 > 2000 ? "#ff4d00" : prices.p1 < 800 ? "#2d31fa" : "inherit" }}>
                    {prices.p1} ₽
                  </span>
                </div>
                <p style={{ fontSize: 14, color: "#666" }}>
                  Тройной смэш из мраморной говядины, фирменный соус, маринованные огурцы на бриоши.
                </p>
                <button
                  className="btn-cta"
                  disabled={BUTTONS_DISABLED}
                  style={{ width: "100%", marginTop: 12, fontSize: 12, opacity: 0.4, cursor: "not-allowed", filter: "grayscale(80%)" }}
                  onClick={() => handleAddToCart("card1")}
                >
                  {buttonLabels.card1}
                </button>
              </div>
            </div>

            <div className="menu-card" style={{ transform: `rotate(${-skewAmount * 0.2}deg) translateY(${Math.abs(skewAmount) * 2}px)` }}>
              <span className="menu-tag" style={{ background: "var(--secondary)" }}>Острое</span>
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Неоновая пицца"
                style={{ filter: `saturate(${1 + Math.abs(skewAmount) * 0.3}) blur(${Math.abs(skewAmount) * 0.2}px)` }}
              />
              <div className="menu-card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <h3>Электро Пепперони</h3>
                  <span className="price">{prices.p2} ₽</span>
                </div>
                <p style={{ fontSize: 14, color: "#666" }}>Двойная пепперони, острый мёд, тесто на закваске.</p>
                <button
                  className="btn-cta"
                  disabled={BUTTONS_DISABLED}
                  style={{ width: "100%", marginTop: 12, fontSize: 12, background: "var(--secondary)", color: "white", opacity: 0.4, cursor: "not-allowed", filter: "grayscale(80%)" }}
                  onClick={() => handleAddToCart("card2")}
                >
                  {buttonLabels.card2}
                </button>
              </div>
            </div>

            <div className="menu-card" style={{ transform: `skewX(${skewAmount * 0.4}deg)` }}>
              <span className="menu-tag" style={{ background: "var(--accent)", color: "var(--dark)" }}>Популярное</span>
              <img
                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Диско Сауэр"
              />
              <div className="menu-card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <h3>Диско Сауэр</h3>
                  <span className="price">{prices.p3} ₽</span>
                </div>
                <p style={{ fontSize: 14, color: "#666" }}>
                  Джин, цветок бузины, голубой чай и съедобная золотая пыльца.
                </p>
                <button
                  className="btn-cta"
                  disabled={BUTTONS_DISABLED}
                  style={{ width: "100%", marginTop: 12, fontSize: 12, background: "var(--accent)", opacity: 0.4, cursor: "not-allowed", filter: "grayscale(80%)" }}
                  onClick={() => handleAddToCart("card3")}
                >
                  {buttonLabels.card3}
                </button>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: 24, padding: 16, border: "2px dashed #ff4d00",
            background: "#fff5f0", textAlign: "center",
            fontSize: 13, color: "#ff4d00", fontWeight: 700,
          }}>
            ⚠️ Внимание: корзина работает в тестовом режиме с 2019 года. Спасибо за понимание.
          </div>
        </section>

        <section className="retro-vibe" style={{ transform: `skewY(${skewAmount * 0.1}deg)` }}>
          <div>
            <h2 className="vibe-title">ВАЙБ-ЧЕК ПРОЙДЕН.</h2>
            <p className="vibe-text">
              Мы не просто кормим. Мы создаём моменты. От плейлиста хип-хопа 90-х до диванов в стиле 70-х — каждый уголок
              продуман для твоего идеального кадра. Бронь не нужна, просто приходи с настроением.
            </p>
            <button
              className="btn-cta"
              disabled={BUTTONS_DISABLED}
              style={{ background: "var(--dark)", color: "white", borderColor: "white", opacity: 0.4, cursor: "not-allowed", filter: "grayscale(80%)" }}
              onClick={() => showBugError("story")}
            >
              {buttonLabels.story}
            </button>
          </div>
          <div className="vibe-img" style={{ filter: `hue-rotate(${skewAmount * 15}deg)` }}></div>
        </section>

        <section className="section-padding">
          <h2 className="section-title" style={{ marginBottom: 40, textAlign: "center", transform: `skewX(${skewAmount}deg)` }}>
            @VINYL.DINER
          </h2>
          <div className="social-grid">
            {[
              "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
              "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            ].map((src, i) => (
              <div
                key={i}
                className="social-item"
                style={{
                  transform: i % 2 === 0 ? `rotate(${skewAmount * 0.5}deg)` : `rotate(${-skewAmount * 0.3}deg)`,
                  cursor: "pointer",
                }}
                onClick={() => showBugError()}
              >
                <img src={src} alt={`Инста ${i + 1}`} style={{ filter: i === 1 ? `invert(${Math.abs(skewAmount) * 5}%)` : "none" }} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer style={{ transform: `skewX(${skewAmount * 0.2}deg)` }}>
        <div>
          <div className="footer-logo">{logoText}</div>
          <p style={{ color: "#666", lineHeight: 1.6 }}>
            Твоё место для еды высокого качества и лоу-фай атмосферы. С 2024, но ощущается как 1974.
          </p>
        </div>
        <div className="footer-links">
          <h4>Навигация</h4>
          <ul>
            {["Меню", "О нас", "Политика", "Контакты"].map((label) => (
              <li key={label}>
                <a href="#" style={{ color: "inherit", textDecoration: "none" }} onClick={(e) => { e.preventDefault(); showBugError(); }}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-links">
          <h4>Часы работы</h4>
          <ul>
            <li>Пн-Пт: 12:00 – 02:00</li>
            <li>Сб-Вс: 10:00 – 04:00</li>
            <li style={{ color: "#ff4d00", fontSize: 12 }}>* часы могут меняться без предупреждения</li>
            <li style={{ color: "#bbb", fontSize: 11 }}>** или вообще быть выдуманы</li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Контакты</h4>
          <ul>
            <li><a href="#" style={{ color: "inherit", textDecoration: "none" }} onClick={(e) => { e.preventDefault(); showBugError(); }}>Instagram</a></li>
            <li><a href="#" style={{ color: "inherit", textDecoration: "none" }} onClick={(e) => { e.preventDefault(); showBugError(); }}>Telegram</a></li>
            <li style={{ fontSize: 12, color: "#bbb" }}>error@vinyl.diner</li>
          </ul>
        </div>
      </footer>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px) rotate(-1deg); }
          40% { transform: translateX(8px) rotate(1deg); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </>
  );
}