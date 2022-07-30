import './Footer.css';

function Link({ uri, text }) {
  return <a href={uri} target="_blank" rel="noreferrer">{text}</a>;
}

function Footer() {
  return (
    <footer className="sub-container">
      <h2>Autres ressources</h2>
      <Link uri={"https://alyra.fr"} text={"Alyra"} />
    </footer >
  );
}

export default Footer;
