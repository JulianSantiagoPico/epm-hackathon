import {
  ArrowRight,
  BarChart3,
  Shield,
  TrendingDown,
  AlertTriangle,
  Link as LinkIcon,
  Github,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  // Telegram bot URL - Actualizar con el bot real
  const TELEGRAM_BOT_URL = "https://t.me/InteliBalance_dudasbot";

  // GitHub repo URL - Actualizar con el repositorio real
  const GITHUB_REPO_URL = "https://github.com/your-repo/intelibalance";

  const features = [
    {
      icon: <TrendingDown className="w-8 h-8 text-primary" />,
      title: "Detección Temprana de Desbalances",
      description:
        "Identifica anomalías en tiempo real antes de que se conviertan en pérdidas significativas.",
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Reducción de Pérdidas",
      description:
        "Minimiza pérdidas técnicas y no técnicas mediante predicción inteligente de volúmenes corregidos.",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: "Continuidad Operativa",
      description:
        "Mantiene el control post-traslado de medidores, asegurando la gestión ininterrumpida de la red.",
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-primary" />,
      title: "Alertas Inteligentes",
      description:
        "Sistema proactivo de notificaciones para irregularidades y situaciones que requieren atención.",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-backgroundSecondary">
      {/* Header/Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, var(--color-primary) 2%, transparent 0%), 
                            radial-gradient(circle at 75px 75px, var(--color-primary) 2%, transparent 0%)`,
              backgroundSize: "100px 100px",
            }}
          ></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Logo placeholder - could be replaced with actual EPM logo */}
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <BarChart3 className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-textMain mb-6 leading-tight">
            Balanc-IA
          </h1>

          <p className="text-2xl md:text-3xl text-primary font-semibold mb-4">
            El balance virtual confirma:{" "}
            <span className="italic">Estamos Ahí</span>
          </p>

          <p className="text-lg md:text-xl text-textSecondary max-w-3xl mx-auto mb-12 leading-relaxed">
            Una solución predictiva desarrollada para optimizar la gestión de
            pérdidas y anomalías en la red secundaria de EPM, impulsando la
            transformación digital.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition-colors shadow-lg hover:shadow-xl flex items-center gap-2 group"
            >
              Inicia Sesión
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => scrollToSection("como-funciona")}
              className="px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-backgroundSecondary transition-colors border-2 border-primary shadow-lg"
            >
              Descubre Cómo Funciona
            </button>

            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-backgroundSecondary transition-colors border-2 border-primary shadow-lg flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Soluciona Dudas
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
          </div>
        </div>
      </section>

      {/* ¿Qué es InteliBalance? Section */}
      <section id="que-es" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-textMain mb-6 text-center">
            ¿Qué es Balanc-IA?
          </h2>

          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-lg text-textSecondary leading-relaxed text-center mb-8">
              Balanc-IA es un modelo predictivo que estima volúmenes corregidos
              en válvulas de anillo sin medición física, utilizando datos
              históricos de macromedición tele-gestionada, consumos de usuarios
              y balances. Esta tecnología permite a EPM mantener un control
              preciso de la red de distribución secundaria de gas natural,
              incluso en puntos donde no hay macromedidores instalados.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-backgroundSecondary rounded-xl hover:shadow-lg transition-shadow border border-border"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-textMain mb-3">
                  {feature.title}
                </h3>
                <p className="text-textSecondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Enlaces a EPM */}
          <div className="bg-linear-to-r from-primary/10 to-secondary/10 rounded-xl p-8 border-l-4 border-primary">
            <h3 className="text-2xl font-semibold text-textMain mb-6 flex items-center gap-2">
              <LinkIcon className="w-6 h-6 text-primary" />
              Integración con Servicios EPM
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <a
                href="https://www.epm.com.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow group"
              >
                <h4 className="font-semibold text-primary mb-2 group-hover:underline">
                  Servicios de Gas Natural
                </h4>
                <p className="text-sm text-textSecondary">
                  Consulta la guía completa de servicios de gas natural, agua y
                  energía de EPM.
                </p>
              </a>

              <a
                href="https://aplicaciones.epm.com.co/revisionesgas/#/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow group"
              >
                <h4 className="font-semibold text-primary mb-2 group-hover:underline">
                  Revisión Periódica de Gas
                </h4>
                <p className="text-sm text-textSecondary">
                  Complementa las revisiones físicas de EPM con nuestro sistema
                  de monitoreo virtual.
                </p>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo Funciona Section */}
      <section id="como-funciona" className="py-20 px-6 bg-backgroundSecondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-textMain mb-6">
            ¿Cómo Funciona?
          </h2>

          <p className="text-lg text-textSecondary leading-relaxed mb-8">
            Balanc-IA utiliza algoritmos avanzados de Machine Learning (XGBoost
            y Prophet) para analizar datos históricos y generar predicciones
            precisas de balances virtuales. El sistema procesa información de
            múltiples fuentes, identifica patrones y detecta anomalías en tiempo
            real, proporcionando alertas accionables para el equipo operativo de
            EPM.
          </p>

          <div className="bg-white p-8 rounded-xl shadow-lg mb-8 border border-border">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h4 className="font-semibold text-textMain mb-2">
                  Recopilación
                </h4>
                <p className="text-sm text-textSecondary">
                  Ingesta de datos históricos de macromedición y consumos
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h4 className="font-semibold text-textMain mb-2">Análisis</h4>
                <p className="text-sm text-textSecondary">
                  Procesamiento con modelos ML para detectar patrones
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h4 className="font-semibold text-textMain mb-2">Acción</h4>
                <p className="text-sm text-textSecondary">
                  Generación de alertas y predicciones accionables
                </p>
              </div>
            </div>
          </div>

          <a
            href="https://unaulaedu-my.sharepoint.com/:b:/g/personal/karly_velasquez0845_unaula_edu_co/IQDS4dTHR2rzTIdneCJ809AOAW-KKnjPrfngwnYI423U7jg?e=FbP93i"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition-colors shadow-lg hover:shadow-xl group"
          >
            Conoce el Funcionamiento Completo Aquí
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>

          <p className="text-sm text-textSecondary mt-4">
            Descarga el PDF con la explicación detallada paso a paso
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-textMain text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Créditos */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Balanc-IA</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Desarrollado por <strong>Karly Mariana Velasquez Acosta</strong>{" "}
                y <strong>Julian Santiago Pico Pinzon</strong> en el Hackathon
                2025 de EPM.
              </p>
            </div>

            {/* Enlaces EPM */}
            <div>
              <h3 className="text-xl font-semibold mb-4">EPM</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.epm.com.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-primary transition-colors"
                  >
                    Sitio Web Oficial
                  </a>
                </li>
                <li>
                  <a
                    href="https://aplicaciones.epm.com.co/revisionesgas/#/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-primary transition-colors"
                  >
                    Revisiones de Gas
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.epm.com.co/site/home/sostenibilidad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-primary transition-colors"
                  >
                    Sostenibilidad
                  </a>
                </li>
              </ul>
            </div>

            {/* Enlaces del proyecto */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href={GITHUB_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a
                    href={TELEGRAM_BOT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Bot de Telegram
                  </a>
                </li>
                <li>
                  <a
                    href="https://colab.research.google.com/drive/1BTW-taT_Zn00DOUNm9euatgfHQI-ZBI_?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-primary transition-colors"
                  >
                    Documentación Técnica
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Balanc-IA - Hackathon EPM. Todos los derechos reservados.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Empresas Públicas de Medellín E.S.P.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
