// import React from 'react'
// import Weather from './components/Weather'

// const App = () => {
//   return (
//     <div className='app'>
//       <Weather />
//     </div>
//   )
// }

// export default App


import Weather from "./components/Weather";

function Header() {
  return (
    <header className="container" style={{ paddingTop: 28, paddingBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.3 }}>
            WeatherApp
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
            Built by Anush Adhikari
          </p>
        </div>
        <a
          href="https://github.com/AnushAdhikari"
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: 13, fontWeight: 600 }}
        >
          GitHub
        </a>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ marginTop: "auto", paddingTop: 28, paddingBottom: 20 }}>
      <div className="container" style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)" }}>
        <p>
          © {new Date().getFullYear()} Anush Adhikari ·{" "}
          <a href="https://github.com/AnushAdhikari/weatherapp" target="_blank" rel="noreferrer">
            Source code
          </a>
        </p>
      </div>
    </footer>
  );
}

function App() {
  return (
    <>
      <Header />
      <main className="container" style={{ flex: 1, paddingBottom: 40 }}>
        <Weather />
      </main>
      <Footer />
    </>
  );
}

export default App;