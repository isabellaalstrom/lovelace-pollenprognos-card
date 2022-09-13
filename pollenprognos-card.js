const LitElement = customElements.get('home-assistant-main')
  ? Object.getPrototypeOf(customElements.get('home-assistant-main'))
  : Object.getPrototypeOf(customElements.get('hui-view'));
const html = LitElement.prototype.html;

class PollenPrognosCard  extends LitElement {

  setConfig(config) {
    if (!config.allergens) {
      throw new Error('Please define allergens (list)');
    }
    if (!config.city) {
      throw new Error('Please define city');
    }
    if (config.threshold && (typeof(config.threshold) != 'number')) {
      throw new Error('Threshold must be a number')
    }
    this.config = config;
  }

  render(){
    if(this.sensors.length < 1) {
      console.log("No sensor data (above threshold or at all), not rendering card.")
      return;
    }
    return html
    `
    ${this._renderMinimalStyle()}
    ${this._renderMinimalCard()}

    `
  }
  _text(state){
    if(state == -1)
      return "Inga halter";
    if(state == 0)
      return "Inga halter";
    if(state == 1)
      return "Låga halter";
    if(state == 2)
      return "Låga-måttliga halter";
    if(state == 3)
      return "Måttliga halter";
    if(state == 4)
      return "Måttliga-höga halter";
    if(state == 5)
      return "Höga halter";
    if(state == 6)
      return "Mycket höga halter";
    if(state == 7)
      return "Extrema halter";
    return state;
  }

  _renderMinimalCard(){
    return html
    `
    <ha-card>
      ${this.config.title == null || this.config.title == true ?
      html`
      <div class="header">
        <div class="name">
        ${this.header}
        </div>
      </div>`
      : ""
    }
      <div class="flex-container">
        ${this.sensors.map(sensor => html`
        <div class="sensor">
          <p class="box">${sensor.allergen_locale}</p>
          <img class="box" src="${this.img_path}/${sensor.allergens.toLowerCase()}_${sensor.forecast.state == "-1" || sensor.forecast.state == "unknown" || sensor.forecast.state == "i.u." || sensor.forecast.state == "unavailable" ? 0 : sensor.forecast.state}.svg"/>
          ${this.config.show_state == true || this.config.show_state == null
            ? html`<p class="box">${sensor.forecast.state == "unknown" || sensor.forecast.state == "i.u." ? sensor.forecast.state : this._text(sensor.forecast.state)}</p>`
            : ""}
        </div>
      `)}
      </div>
    </ha-card>
    `
  }

  _renderMinimalStyle() {
    return html
    `
    <style>
    ha-card {
      padding: 16px;
    }
    .header {
      padding: 0;
      @apply --paper-font-headline;
      line-height: 40px;
      color: var(--primary-text-color);
      padding: 4px 0 12px;
    }
    .forecast {
      width: 100%;
      padding: 7px;
      height: 100%;
    }
    td {
      padding: 3px;
      text-align: center;
    }
    .flex-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      text-align: center;
      justify-content: space-evenly;
      align-items: center;
    }
    .sensor {
      margin: 10px;
      flex: 1 1 0;
      flex-direction: column;
      justify-content: space-evenly;
      display: flex;
      align-self: flex-start;
    }
    @supports not (-ms-flex: 1) {
      .flex-container {
        height: auto; /* 2 */
        // min-height: 24em; /* 2 */
      }
    }
    img {
      max-height: 50px;
    }
    .sensor {
      display: block;
      min-width: 16.66%;
      flex: 1;
    }
    </style>`
  }


  _tryParseInt(str,defaultValue) {
    var retValue = defaultValue;
    if(str !== null) {
        if(str.length > 0) {
            if (!isNaN(str)) {
                retValue = parseInt(str);
            }
        }
    }
    return retValue;
  }
  set hass(hass) {

    this._hass = hass;
    var sensors = [];

    if (this.config.title == null || this.config.title == true) {
      var header_city = this.config.city
      this.header = `Pollenprognos ${header_city.charAt(0).toUpperCase() + header_city.slice(1)}`;
    }

    if (this.config.img_path != null) {
      this.img_path = this.config.img_path;
    } else {
      this.img_path = "/local/pollen_img";
    }

    const cityConf = this.config.city.toLowerCase();
    var cityReplace1 = cityConf.replace('å', 'a')
    var cityReplace2 = cityReplace1.replace('ä', 'a')
    var city = cityReplace2.replace('ö', 'o')

    const allergens = this.config.allergens;
    for (var i = 0; i < allergens.length; i++) {
      var dict = {};
      dict.allergen_locale = (allergens[i].charAt(0).toUpperCase() + allergens[i].slice(1));
      var allergen = allergens[i].replace(' / ', '_').toLowerCase();

      var allergenReplace = allergen.replace('å', 'a')
      var allergenReplace2 = allergenReplace.replace('ä', 'a')
      var allergenReplaced = allergenReplace2.replace('ö', 'o')

      dict.allergens = allergenReplaced
      dict.forecast = hass.states[`sensor.pollen_${city}_${allergenReplaced}`]
      if (dict.forecast.state == "unknown") {
        if (dict.forecast === undefined) continue;
        // var log_text = `A sensor for "${dict.allergen_locale}" is returning unknown, you should probably check your config for that sensor in the custom component.`;
        // console.log(log_text)
      }

      if (this.config.threshold != null) {
        if (this._tryParseInt(dict.forecast.state, 0) >= this.config.threshold) {
          sensors.push(dict)
        }
      }
      else {
        sensors.push(dict)
      }
    }

    this.sensors = sensors;
    this.requestUpdate();
  }



  // @TODO: This requires more intelligent logic
  getCardSize() {
    return 1;
  }
}

class HAPC extends PollenPrognosCard {} ;
customElements.define('pollenprognos-card', PollenPrognosCard);
