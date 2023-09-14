# pollenprognos-card
A Lovelace custom card for [custom component Pollenprognos](https://github.com/JohNan/homeassistant-pollenprognos) in Home Assistant.

<b>You need to manually move the folder `pollen_img` directly inside your `www`
folder for the images to appear, or set the `img_path` configuration value to
the prefix of the URL where the images are reachable.</b>

## Installation

For installation instructions [see this guide](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins).

## Example usage
Pick the allergens you want to display.

For ui-mode:
```yaml
type: 'custom:pollenprognos-card'
city: Stockholm
allergens:
  - Al
  - Alm
  - Ambrosia
  - Björk
  - Ek
  - Gråbo
  - Gräs
  - Hassel
  - Sälg / vide   # this one is important you write just like this.
```

For yaml-mode:
```yaml
- type: 'custom:pollenprognos-card'
  city: Stockholm
  allergens:
    - Al
    - Alm
    - Ambrosia
    - Björk
    - Ek
    - Gråbo
    - Gräs
    - Hassel
    - Sälg / vide   # this one is important you write just like this.
```

Usage in a view:
```yaml
title: My awesome Lovelace!
resources:
  - url: /local/pollenprognos-card.js
    type: module
views:
  title: My view
  cards:
    - type: 'custom:pollenprognos-card'
      city: Stockholm
      allergens:
        - Al
        - Alm
        - Ambrosia
        - Björk
        - Ek
        - Gråbo
        - Gräs
        - Hassel
        - Sälg / vide   # this one is important you write just like this.
```

## Options

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `custom:pollenprognos-card`
| city | string | **Required** | City from which you have sensors (note: Bräkne-Hoby has to be written as `Bräkne_Hoby`, otherwise it will not work)
| allergens | list | **Required** | List of allergens for which you have sensors
| title | boolean | **Optional** | Set to `false` to remove the heading from the card
| show_state | boolean | **Optional** | Set to `false` if you don't want to show the state text under the images.
| threshold | number | **Optional** | Set to a number if you don't want to show allergens below that number (set to `0` to only exclude unknown or i.u.).
| img_path | string | **Optional** | The URL prefix for where to find the images; defaults to `"/local/pollen_img"`)

### Example of the card with all allergens presented
![2021-04-23 14_24_23-Admin - Home Assistant](https://user-images.githubusercontent.com/22006797/115870566-b4e91080-a43f-11eb-843e-1f5efbcc2a84.png)

Like my work and want to say thanks? Do it here:

<a href="https://www.buymeacoffee.com/iq1f96D" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/purple_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>
