export const styles = `
  div, span, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, code, img, b, u, i, center, table, tr, th, td, video {
    margin: 0;
    padding: 0;
    border: 0;
  }

  body {
    margin: 0;
    background: #ffffff;
    font-family: 'Manrope', Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #000;
    font-weight: 400;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  h1 {
    font-size: 40px;
    line-height: 1.2;
    font-weight: 700;
    margin: 0 0 40px;
  }

  h2 {
    font-size: 30px;
    line-height: 1.2;
    font-weight: 700;
    margin: 0 0 30px;
  }

  h3 {
    font-size: 20px;
    line-height: 1.2;
    font-weight: 700;
    margin: 0 0 20px;
  }

  p {
    margin: 0 0 15px;
  }

  p.heading-description {
    margin-top: -20px;
    margin-bottom: 30px;
  }

  .markdown h3 {
    margin-top: 40px;
  }

  .t-container {
    margin: 0 auto 50px;
    padding: 50px 0 0;
    width: 100%;
    max-width: 960px;

    page-break-after: always;
  }

  .cover-container {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 100vh;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    color: #fff;
  }

  .cover-filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
  }

  .cover-title {
    font-size: 40px;
    line-height: 1.2;
    font-weight: 500;
    margin: 0;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  @media screen and (max-width: 1200px) {
    .t-container {
        max-width:960px;
    }
  }

  @font-face {
    font-family: 'Manrope';
    src: url('https://static.tildacdn.com/tild3932-3732-4163-a231-646235636535/Manrope-Light.woff') format('woff');
    font-weight: 300;
    font-style: normal
  }

  @font-face {
      font-family: 'Manrope';
      src: url('https://static.tildacdn.com/tild6662-3766-4230-b431-323465653361/Manrope-Regular.woff') format('woff');
      font-weight: 400;
      font-style: normal
  }

  @font-face {
      font-family: 'Manrope';
      src: url('https://static.tildacdn.com/tild3262-6661-4265-b730-313832623763/Manrope-Medium.woff') format('woff');
      font-weight: 500;
      font-style: normal
  }

  @font-face {
      font-family: 'Manrope';
      src: url('https://static.tildacdn.com/tild6333-3531-4038-b762-303565353864/Manrope-SemiBold.woff') format('woff');
      font-weight: 600;
      font-style: normal
  }

  @font-face {
      font-family: 'Manrope';
      src: url('https://static.tildacdn.com/tild3937-6639-4936-a238-646161343936/Manrope-Bold.woff') format('woff');
      font-weight: 700;
      font-style: normal
  }
`;
