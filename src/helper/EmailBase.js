function PrepararEmail(titulo, body) {
    let conteudo = "<!DOCTYPE html>";
    conteudo += "<html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'>";
    conteudo += "<style>";
    conteudo += "body {font-family: Arial, sans-serif;background-color: #f4f4f4;margin: 0;padding: 0;}";
    conteudo += ".container {max-width: 600px;margin: 0 auto;padding: 20px;background-color: #fff;border-radius: 8px;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);}";
    conteudo += ".logo {text-align: center;margin-bottom: 20px;}";
    conteudo += ".logo img {max-width: 150px;}";
    conteudo += ".title {font-size: 24px;font-weight: bold;color: #3899ec;margin-bottom: 10px;}";
    conteudo += ".content {margin-bottom: 20px;}";
    conteudo += ".button {display: inline-block;padding: 10px 20px;background-color: #3899ec;color: #fff;text-decoration: none;border-radius: 4px;}";
    conteudo += ".button:hover {background-color: #2984c9;}";
    conteudo += "@media (max-width: 600px) {";
    conteudo += ".container {border-radius: 0;box-shadow: none;padding: 10px;}";
    conteudo += "}";
    conteudo += ".hash {font-size: 48px;font-weight: bold;letter-spacing: 10px;line-height: 1.2;}";
    conteudo += "</style>";
    conteudo += "</head>";
    conteudo += "<body>";
    conteudo += "<div class='container'>";
    conteudo += "<div class='logo'>";
    conteudo += "<img src='https://static.wixstatic.com/media/58f9c9_c363ce3e7e9e4e4f9c685246d3215a31~mv2.png/v1/fill/w_570,h_160,al_c,usm_0.66_1.00_0.01/LOGO_MIX_DA_SA%C3%83%C2%9ADE_-_SEU_ACESSO_A_SA%C3%83%C2%9ADE.png' alt='Logo Mix da Saúde'>";
    conteudo += "</div>";
    conteudo += "<div class='title'>" + titulo + "</div>";
    conteudo += "<div class='content'>";
    conteudo += body;
    conteudo += "</div>";
    conteudo += "</div>";
    conteudo += "</body>";
    conteudo += "</html>";

    return conteudo;
}

module.exports = { PrepararEmail }