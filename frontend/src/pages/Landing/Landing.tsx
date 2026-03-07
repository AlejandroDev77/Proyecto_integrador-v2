import { useEffect, useState } from "react";
import { getMuebles } from "../../services/Landing";
import Layout from "../../components/layout/Layout";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Hero from "../../components/Home/Hero";
import Benefits from "../../components/Home/Benefits";
import Products from "../../components/Home/products";
import Process from "../../components/Home/Process";
import FAQ from "../../components/Home/FAQ";
import CTA from "../../components/Home/CTA";
import Contact from "../../components/Home/Contact";

const Landing = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMuebles();
        const muebles = data
          .filter((m: any) => m.est_mue)
          .slice(0, 3)
          .map((m: any) => ({
            id: m.id_mue,
            title: m.nom_mue,
            img: m.img_mue ? m.img_mue.replace("public", "") : "/images/no-image.png",
            category: m.categoria?.nom_cat || "Sin categoría",
            price: `Bs. ${m.precio_venta}`,
            desc: m.desc_mue,
          }));
        setProducts(muebles);
      } catch {
        setProducts([]);
      }
    })();
  }, []);

  return (
    <Layout>
      <Navbar />
      <Hero />
      <Benefits />
      <Products products={products} />
      <Process />
      <FAQ />
      <CTA />
      <Contact />
      <Footer />
    </Layout>
  );
};

export default Landing;
