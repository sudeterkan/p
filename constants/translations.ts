export const translations = {
  en: {
    // Common
    appName: "ParkMate",
    welcome: "Welcome!",
    loading: "Loading...",
    error: "Error",
    cancel: "Cancel",
    confirm: "Confirm",
    copy: "Copy",
    copied: "Copied!",

    // Auth
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    loginButton: "Login",
    registerButton: "Register",
    noAccount: "Don't have an account? Register",
    haveAccount: "Already have an account? Login",
    logout: "Logout",

    // QR/PIN Operations
    pinOperations: "PIN Operations",
    enterPin: "Enter PIN",
    pinCode: "PIN Code",
    enterPinPlaceholder: "4-digit PIN",
    invalidPin: "⚠️ Invalid PIN",
    pinNotFound: "No entry found with this PIN code.",
    usePinOnExit: "Please use this code when exiting.",
    duration: "Duration",
    price: "Price",
    minutes: "minutes",
    currency: "TL",

    // History
    historyTitle: "History",
    pastOperations: "Past Operations",
    noRecords: "No records found.",
    type: "Type",
    pin: "PIN",
    entry: "Entry",
    exit: "Exit",
    entryTime: "Entry Time",
    exitTime: "Exit Time",
    statusActive: "Active",
    statusCompleted: "Completed",

    // Navigation
    navHome: "Home",
    navHistory: "History",
    navPayments: "Payments",
    navPinOperations: "PIN Operations",
    navSettings: "Settings",

    // Errors
    fillAllFields: "Please fill in all fields.",
    invalidEmail: "Invalid email address.",
    userNotFound: "User not found. Please register.",
    wrongPassword: "Wrong password. Please try again.",
    loginFailed: "Login failed. Please check your information.",

    theme: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
  },
  tr: {
    // Common
    appName: "ParkMate",
    welcome: "Hoş Geldiniz!",
    loading: "Yükleniyor...",
    error: "Hata",
    cancel: "İptal",
    confirm: "Onayla",
    copy: "Kopyala",
    copied: "Kopyalandı!",

    // Auth
    login: "Giriş Yap",
    register: "Kayıt Ol",
    email: "E-posta",
    password: "Şifre",
    confirmPassword: "Şifre Tekrar",
    loginButton: "Giriş Yap",
    registerButton: "Kayıt Ol",
    noAccount: "Hesabınız yok mu? Kayıt olun",
    haveAccount: "Zaten hesabınız var mı? Giriş yapın",
    logout: "Çıkış Yap",

    // QR/PIN Operations
    pinOperations: "PIN İşlemleri",
    enterPin: "PIN Kodunuzu Girin",
    pinCode: "PIN Kodu",
    enterPinPlaceholder: "4 Haneli PIN",
    invalidPin: "⚠️ Hatalı PIN",
    pinNotFound: "Bu PIN koduyla giriş bulunamadı.",
    usePinOnExit: "Lütfen çıkışta bu kodu kullanın.",
    duration: "Süre",
    price: "Ücret",
    minutes: "dakika",
    currency: "TL",

    // History
    historyTitle: "Geçmiş",
    pastOperations: "Geçmiş İşlemler",
    noRecords: "Kayıt bulunamadı.",
    type: "Tür",
    pin: "PIN",
    entry: "Giriş",
    exit: "Çıkış",
    entryTime: "Giriş Saati",
    exitTime: "Çıkış Saati",
    statusActive: "Aktif",
    statusCompleted: "Tamamlandı",

    // Navigation
    navHome: "Ana Sayfa",
    navHistory: "Geçmiş",
    navPayments: "Ödemeler",
    navPinOperations: "PIN İşlemleri",
    navSettings: "Ayarlar",

    // Errors
    fillAllFields: "Lütfen tüm alanları doldurun.",
    invalidEmail: "Geçersiz e-posta adresi girdiniz.",
    userNotFound: "Kullanıcı bulunamadı. Lütfen kayıt olun.",
    wrongPassword: "Şifre yanlış. Lütfen tekrar deneyin.",
    loginFailed: "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.",

    theme: "Tema",
    themeLight: "Açık",
    themeDark: "Koyu",
  },
};

export type Language = "en" | "tr";
export type TranslationKey = keyof typeof translations.en;
