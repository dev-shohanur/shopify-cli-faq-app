const createOstIframe = () => {
  if (Shopify?.shop) {
    const GeneralFaq = document.getElementById("general-faq");
    const groupId = GeneralFaq.getAttribute("data-groupID");
    const Link = `https://letting-tablet-creator-hairy.trycloudflare.com/faqs/${groupId}?shop=${Shopify?.shop}`;
    const Iframe = document.createElement("iframe");

    Iframe.src = Link;
    Iframe.frameBorder = "0";
    Iframe.scrolling = "yes";
    Iframe.width = "100%";
    Iframe.height = "100%";
    Iframe.style = "min-height: 420px;";
    Iframe.className = "faq-container";
    GeneralFaq.appendChild(Iframe);
  }

};

createOstIframe();