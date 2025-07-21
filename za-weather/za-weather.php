<?php
/**
 * Plugin Name: ZAWeather
 * Description: Simple weather widget using Open-Meteo API and Windy embed.
 * Version: 1.0.0
 * Author: ZAWeather Team
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

function zaweather_enqueue_assets() {
    $plugin_url = plugin_dir_url( __FILE__ );
    wp_enqueue_style( 'zaweather-style', $plugin_url . 'css/zaweather.css' );
    wp_enqueue_script( 'suncalc', 'https://cdnjs.cloudflare.com/ajax/libs/suncalc/1.9.0/suncalc.min.js', array(), null, true );
    wp_enqueue_script( 'zaweather-script', $plugin_url . 'js/zaweather.js', array( 'suncalc' ), null, true );
}
add_action( 'wp_enqueue_scripts', 'zaweather_enqueue_assets' );

function zaweather_shortcode( $atts ) {
    ob_start();
    ?>
    <div class="zaweather-container">
      <div class="weather-widget">
        <div id="current" class="current-btn">
          <span class="icon" id="current-icon"></span>
          <span id="temperature" class="value"></span>°C
        </div>
        <div class="live-table">
          <div>
            <div>Wind: <span id="wind" class="value"></span> km/h</div>
            <div>Humidity: <span id="humidity" class="value"></span>%</div>
            <div>Cloud Cover: <span id="cloud" class="value"></span>%</div>
            <div>Sunrise: <span id="sunrise" class="value"></span></div>
            <div>Sunset: <span id="sunset" class="value"></span></div>
          </div>
          <div>
            <div>Moonrise: <span id="moonrise" class="value"></span></div>
            <div>Moonset: <span id="moonset" class="value"></span></div>
            <div>Moon Phase: <span id="moonphase-icon" class="icon"></span><span id="moonphase" class="value"></span></div>
            <div>Moon Illumination: <span id="moonillum" class="value"></span>%</div>
          </div>
        </div>
        <div id="forecast" class="forecast"></div>
        <div id="cloud-forecast" class="forecast cloud-forecast"></div>
      </div>

      <iframe
        src="https://embed.windy.com/embed2.html?lat=-32.3587&lon=20.6203&zoom=4&level=surface&overlay=clouds&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&detailLat=-32.3587&detailLon=20.6203&metricWind=default&metricTemp=default&radarRange=-1&play=1"
        allowfullscreen="allowfullscreen"></iframe>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'zaweather', 'zaweather_shortcode' );
