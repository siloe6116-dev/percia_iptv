package com.percia.iptv;

import android.app.*;
import android.os.*;
import android.view.*;
import android.webkit.*;
import android.widget.FrameLayout;

public class MainActivity extends Activity {
    private WebView web;
    private View customView;
    private WebChromeClient.CustomViewCallback customCallback;

    private void immersive() {
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
            View.SYSTEM_UI_FLAG_FULLSCREEN |
            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
            View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
            View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
    }
    @Override public void onCreate(Bundle b) {
        super.onCreate(b);
        immersive();
        web = new WebView(this);
        web.setBackgroundColor(0xFF101010);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setAllowFileAccessFromFileURLs(true);
        s.setAllowUniversalAccessFromFileURLs(true);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        web.setWebChromeClient(new WebChromeClient() {
            @Override public void onShowCustomView(View view, CustomViewCallback callback) {
                if (customView != null) { callback.onCustomViewHidden(); return; }
                customView = view; customCallback = callback;
                ((FrameLayout)findViewById(android.R.id.content)).addView(view,
                    new FrameLayout.LayoutParams(-1,-1));
                web.setVisibility(View.GONE); immersive();
            }
            @Override public void onHideCustomView() {
                if (customView == null) return;
                ((FrameLayout)findViewById(android.R.id.content)).removeView(customView);
                customView = null; web.setVisibility(View.VISIBLE);
                if (customCallback != null) customCallback.onCustomViewHidden();
                immersive();
            }
        });
        setContentView(web);
        web.loadUrl("file:///android_asset/index.html");
    }
    @Override public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus); if (hasFocus) immersive();
    }
    @Override public void onBackPressed() {
        if (customView != null) {
            ((FrameLayout)findViewById(android.R.id.content)).removeView(customView);
            customView = null;
            web.setVisibility(View.VISIBLE);
            immersive();
            return;
        }
        if (web != null) {
            web.evaluateJavascript(
                "(window.handleAndroidBack ? window.handleAndroidBack() : false)",
                value -> {
                    if (!"true".equals(value)) {
                        if (web.canGoBack()) web.goBack();
                        else MainActivity.super.onBackPressed();
                    }
                }
            );
        } else {
            super.onBackPressed();
        }
    }
}
