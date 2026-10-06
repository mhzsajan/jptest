import java.util.Properties

plugins {
    id("com.android.application")
}

// Signing credentials live in keystore.properties, which is gitignored.
// Never hardcode a keystore password in a committed build file.
val keystorePropsFile = rootProject.file("keystore.properties")
val keystoreProps = Properties().apply {
    if (keystorePropsFile.exists()) {
        keystorePropsFile.inputStream().use { load(it) }
    }
}
val hasReleaseKeystore = keystoreProps.getProperty("storeFile")?.let { file(it).exists() } == true

android {
    // Must match the previously published APK's package so this is the same app
    // identity going forward. (It still cannot upgrade in place: the old APK was
    // signed with a debug key that no longer exists on this machine. See docs.)
    namespace = "com.example.jptest"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.jptest"
        minSdk = 21
        targetSdk = 35
        versionCode = 2
        versionName = "2.0.0"
    }

    signingConfigs {
        if (hasReleaseKeystore) {
            create("release") {
                storeFile = file(keystoreProps.getProperty("storeFile"))
                storePassword = keystoreProps.getProperty("storePassword")
                keyAlias = keystoreProps.getProperty("keyAlias")
                keyPassword = keystoreProps.getProperty("keyPassword")
            }
        }
    }

    buildTypes {
        release {
            // With no release keystore present, fall back to the debug key so the
            // build still produces an installable artifact instead of failing.
            signingConfig = if (hasReleaseKeystore) {
                signingConfigs.getByName("release")
            } else {
                signingConfigs.getByName("debug")
            }
            isMinifyEnabled = false
            isShrinkResources = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-debug"
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    packaging {
        resources.excludes += setOf("META-INF/*.kotlin_module")
    }
}

dependencies {
    // Intentionally none. Everything used is a platform API.
}