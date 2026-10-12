package com.wordquest.puzzle;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;

public class SplashActivity extends Activity {
    private static final long SPLASH_DURATION_MS = 950L;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        getWindow().setStatusBarColor(getColor(R.color.splash_background));
        getWindow().setNavigationBarColor(getColor(R.color.splash_background));

        View content = findViewById(R.id.splash_content);
        View logo = findViewById(R.id.splash_logo_frame);
        content.setAlpha(0f);
        content.setTranslationY(18f);
        logo.setScaleX(0.88f);
        logo.setScaleY(0.88f);
        content.animate().alpha(1f).translationY(0f).setDuration(420L).start();
        logo.animate().scaleX(1f).scaleY(1f).setDuration(520L).setStartDelay(80L).start();

        getWindow().getDecorView().postDelayed(() -> {
            startActivity(new Intent(SplashActivity.this, MainActivity.class));
            finish();
        }, SPLASH_DURATION_MS);
    }
}
