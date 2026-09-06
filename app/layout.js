import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "notesportal",
  description: "Ai powered collaborative learning platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable}`} suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try {
              var stored = JSON.parse(localStorage.getItem('np-theme') || 'null');
              var root = document.documentElement;
              if (!stored) {}
              else if (stored.mode === 'purple') {
                root.setAttribute('data-theme', 'purple');
              } else if (stored.mode === 'custom' && stored.customColor) {
                var hex = stored.customColor.replace('#', '');
                var r = parseInt(hex.substring(0,2),16)/255, g = parseInt(hex.substring(2,4),16)/255, b = parseInt(hex.substring(4,6),16)/255;
                var max = Math.max(r,g,b), min = Math.min(r,g,b), l = (max+min)/2, h = 0, s = 0;
                if (max !== min) {
                  var d = max-min;
                  s = l > 0.5 ? d/(2-max-min) : d/(max+min);
                  if (max === r) h = (g-b)/d + (g<b?6:0);
                  else if (max === g) h = (b-r)/d + 2;
                  else h = (r-g)/d + 4;
                  h *= 60;
                } else { h = 0; }
                s *= 100; l *= 100;
                function clamp(v,mn,mx){ return Math.max(mn, Math.min(mx, v)); }
                function hslToHex(hh,ss,ll){
                  hh = ((hh % 360) + 360) % 360 / 360; ss /= 100; ll /= 100;
                  if (ss === 0) { var v = Math.round(ll*255); var vh = v.toString(16).padStart(2,'0'); return '#'+vh+vh+vh; }
                  var q = ll < 0.5 ? ll*(1+ss) : ll+ss-ll*ss;
                  var p = 2*ll-q;
                  function h2(t){ if(t<0)t+=1; if(t>1)t-=1; if(t<1/6) return p+(q-p)*6*t; if(t<0.5) return q; if(t<2/3) return p+(q-p)*(2/3-t)*6; return p; }
                  function toHex(x){ var vv = Math.round(x*255).toString(16); return vv.length===1 ? '0'+vv : vv; }
                  return '#'+toHex(h2(hh+1/3))+toHex(h2(hh))+toHex(h2(hh-1/3));
                }
                var stopDeltas = {200:[9,27],300:[6,20],400:[4,10],600:[-10,-9],700:[-19,-18],800:[-24,-26],900:[-25,-33],950:[-4,-44]};
                root.style.setProperty('--color-purple-500', stored.customColor);
                for (var stop in stopDeltas) {
                  root.style.setProperty('--color-purple-'+stop, hslToHex(h, clamp(s+stopDeltas[stop][0],0,100), clamp(l+stopDeltas[stop][1],4,97)));
                }
                var panels = {a:[40,17],b:[38,11],c:[42,14],d:[50,25],e:[72,14],f:[75,22],g:[46,8],h:[47,11],i:[51,14]};
                for (var p in panels) {
                  root.style.setProperty('--theme-panel-'+p, hslToHex(h, panels[p][0], panels[p][1]));
                }
                root.style.setProperty('--theme-toast-bg', hslToHex(h, 64, 11));
                root.style.setProperty('--color-indigo-500', hslToHex(h-32, 84, 67));
                root.style.setProperty('--color-violet-500', hslToHex(h-13, 90, 66));
                root.style.setProperty('--color-violet-600', hslToHex(h-9, 83, 58));
                root.style.setProperty('--color-fuchsia-600', hslToHex(h+22, 69, 49));
                function hslToRgbStr(hh,ss,ll){
                  var hexc = hslToHex(hh,ss,ll).replace('#','');
                  return parseInt(hexc.substring(0,2),16)+' '+parseInt(hexc.substring(2,4),16)+' '+parseInt(hexc.substring(4,6),16);
                }
                root.style.setProperty('--theme-glow-500', hslToRgbStr(h, s, l));
                root.style.setProperty('--theme-glow-600', hslToRgbStr(h, clamp(s+stopDeltas[600][0],0,100), clamp(l+stopDeltas[600][1],4,97)));
                root.style.setProperty('--theme-glow-violet-500', hslToRgbStr(h-13, 90, 66));
                root.setAttribute('data-theme', 'custom');
              }
            } catch (e) {}`,
          }}
        />
      </head>
      <body className="antialiased font-poppins">
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--theme-toast-bg)',
                color: '#fff',
                border: '1px solid var(--color-purple-600)',
              },
            }}
          />
        </ThemeProvider>
        <Analytics/>
        <SpeedInsights/>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}
          </Script>
        </>
      )}
    </html>
  );
}
