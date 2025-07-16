export const styles = `
  .schedule-container {

  }

  .schedule-day {
    margin-bottom: 20px;
  }

  .schedule-day-title {
    text-align: center;
    font-size: 42px;
    font-weight: bold;
    margin-bottom: 105px;
  }

  .places-container {
    padding-top: 40px;
  }

  .places-place {
    display: flex;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: 1200px;
    padding-bottom: 40px;
    
  }

  .places-place p {
    font-weight: 300;
  }

  .places-place p strong {
    font-weight: 700;
  }

  .places-place-left {
    display: inline;
    float: left;
    margin-left: 20px;
    margin-right: 20px;
    width: 100%;
    max-width: 860px;
  }

  .places-place-right {
    display: inline;
    float: left;
    margin-left: 20px;
    margin-right: 20px;
    width: 100%;
    max-width: 160px;
    font-size: 14px;
    color: #4b4b4b;
  }

  .places-place-right-tags {

  }

  .places-place-right-tag {
    color: rgb(255, 121, 58);
  }

  .t565 .t-section__bottomwrapper {
      margin-top: 105px
  }

  .t565 {
      counter-reset: number
  }

  .t565 .t565__number::before {
      counter-increment: number;
      content: counter(number)
  }

  .t565__mainblock::after,.t565__mainblock::before {
      content: '';
      display: table;
      clear: both
  }

  .t565__item {
      position: relative;
      padding-bottom: 30px
  }

  .t565__item:last-child {
      padding-bottom: 0
  }

  .t565__item:nth-child(odd) .t565__block {
      padding-right: 56px;
      padding-left: 0
  }

  .t565__item:nth-child(even) .t565__block {
      padding-right: 0;
      padding-left: 56px
  }

  .t565__mainblock {
      margin: 0 auto
  }

  .t565__line {
      position: absolute;
      width: 2px;
      inset: 0;
      background: #222;
      margin: 0 auto
  }

  .t565__item:first-child .t565__line {
      top: 10px
  }

  .t565__item:last-child .t565__line {
      height: 10px;
      bottom: auto
  }

  .t565__col {
      width: 50%;
      text-align: right;
  }

  .t565__item:nth-child(even) .t565__col {
      float: right!important;
      text-align: left
  }

  .t565__circle {
      width: 46px;
      height: 46px;
      position: absolute;
      right: 0;
      left: 0;
      top: 5px;
      margin: 0 auto;
      background-color: #222;
      border-radius: 100%;
      border: 2px solid #fff
  }

  .t565__number {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      text-align: center;
      -moz-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      -webkit-transform: translateY(-50%);
      -o-transform: translateY(-50%);
      transform: translateY(-50%);
      color: #fff
  }

  .t565__img {
      width: 100%;
      display: block;
      margin-bottom: 14px;
      margin-left: auto
  }

  .t565__item:nth-child(even) .t565__img {
      margin-left: 0
  }

  .t565__title {
      margin-bottom: 6px;
      margin-top: 10px
  }

  .t565__descr {
      margin-top: 10px;
      margin-bottom: 5px
  }

  .t565__link {
      display: inline-block
  }
`;
