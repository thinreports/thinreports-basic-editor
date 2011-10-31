/****************************************************************************
**
** Copyright (C) 2011 Matsukei Co.,Ltd.
**
** This program is free software: you can redistribute it and/or modify
** it under the terms of the GNU General Public License as published by
** the Free Software Foundation, either version 3 of the License, or
** (at your option) any later version.
**
** This program is distributed in the hope that it will be useful,
** but WITHOUT ANY WARRANTY; without even the implied warranty of
** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
** GNU General Public License for more details.
**
** You should have received a copy of the GNU General Public License
** along with this program.  If not, see <http://www.gnu.org/licenses/>.
**
****************************************************************************/

#include <QtGui>
#include <QtWebKit>
#include <QDir>
#include <QFontDatabase>
#include <QFileInfo>
#include "platform.h"

Platform::Platform(QWidget *parent)
    : QMainWindow(parent)
{
    view = new QWebView(this);
}

void Platform::boot(const QString core)
{
    QString app = adjustPath(core);

    if (!isDebugMode() && !QFile::exists(app)) {
        QMessageBox::critical(this, tr("ThinReportsEditor Booting Error"),
                              "Unable to load application.");
        exit(0);
    }

    view->load(app);

    setup();

    connect(view, SIGNAL(loadFinished(bool)), this, SLOT(init()));
    connect(view->page()->mainFrame(), SIGNAL(javaScriptWindowObjectCleared()),
            this, SLOT(populateJavaScript()));
    connect(view->page(), SIGNAL(windowCloseRequested()), this, SLOT(windowCloseRequested()));
    connect(view, SIGNAL(linkClicked(QUrl)), this, SLOT(openUrl(QUrl)));

    show();
}

void Platform::setup()
{
    // Load built-in fonts.
    QDirIterator it(adjustPath(QLatin1String("fonts")));
    while (it.hasNext()) {
        it.next();
        if (it.fileInfo().completeSuffix().toLower() == "ttf") {
            QFontDatabase::addApplicationFont(it.filePath());
        }
    }

    // Setup of WebView.
    setAttribute(Qt::WA_InputMethodEnabled, true);

    view->setMinimumWidth(800);
    view->setMinimumHeight(600);

    QWebSettings *settings = view->settings();

    settings->setDefaultTextEncoding("utf-8");
    settings->setAttribute(QWebSettings::LocalStorageEnabled, true);
    settings->setLocalStoragePath(adjustPath("."));

    view->page()->setLinkDelegationPolicy(QWebPage::DelegateExternalLinks);

    if (!isDebugMode()) {
        view->setAcceptDrops(false);
        view->setContextMenuPolicy(Qt::PreventContextMenu);
    } else {
        settings->setAttribute(QWebSettings::DeveloperExtrasEnabled, true);
    }

    // Setup of Widget.
    setCentralWidget(view);
    resize(1000, 700);
}

QString Platform::adjustPath(const QString &path)
{
#ifdef Q_OS_UNIX
#ifdef Q_OS_MAC
    if (!QDir::isAbsolutePath(path))
        return QCoreApplication::applicationDirPath()
                + QLatin1String("/../Resources/") + path;
#else
    const QString pathInInstallDir = QCoreApplication::applicationDirPath()
        + QLatin1String("/../") + path;
    if (pathInInstallDir.contains(QLatin1String("opt"))
            && pathInInstallDir.contains(QLatin1String("bin"))
            && QFileInfo(pathInInstallDir).exists()) {
        return pathInInstallDir;
    }
#endif
#endif
    return path;
}

bool Platform::isDebugMode()
{
    if (QApplication::argc() > 1) {
        QString arg = QApplication::argv()[1];
        return arg == "-d";
    }
    return false;
}

void Platform::init()
{
    setWindowTitle(view->title());
    setFocus();
}

void Platform::populateJavaScript()
{
    view->page()->mainFrame()
            ->addToJavaScriptWindowObject("__treFileUtils__", new JsExtFile(this));
    view->page()->mainFrame()
            ->addToJavaScriptWindowObject("__treFontUtils__", new JsExtFont(this));
    view->page()->mainFrame()
            ->addToJavaScriptWindowObject("__treImageUtils__", new JsExtImage(this));
    view->page()->mainFrame()
            ->addToJavaScriptWindowObject("__treStringUtils__", new JsExtString(this));
    view->page()->mainFrame()
            ->addToJavaScriptWindowObject("__treWindowUtils__", new JsExtWindow(this));

    QStringList initScript;
    initScript
            << "(function(){"
            << "  var utils = {"
            << "    File: window.__treFileUtils__, "
            << "    Font: window.__treFontUtils__, "
            << "    Image: window.__treImageUtils__, "
            << "    String: window.__treStringUtils__, "
            << "    Window: window.__treWindowUtils__"
            << "  };"
            << "  window.platform = utils;"
            << "  delete window.__treFileUtils__;"
            << "  delete window.__treFontUtils__;"
            << "  delete window.__treImageUtils__;"
            << "  delete window.__treStringUtils__;"
            << "  delete window.__treWindowUtils__;"
            << "})();";
    view->page()->mainFrame()
            ->evaluateJavaScript(initScript.join(""));
}

void Platform::windowCloseRequested()
{
    close();
}

void Platform::openUrl(QUrl url)
{
    QDesktopServices::openUrl(url);
}

void Platform::closeEvent(QCloseEvent *evClose)
{
    QStringList beforeScript;
    beforeScript
            << "(function(){"
            << "  if (typeof window.onbeforeclose == 'function') {"
            << "    return window.onbeforeclose();"
            << "  } else {"
            << "    return true;"
            << "  }"
            << "})();";

    QVariant result = view
                      ->page()
                      ->mainFrame()
                      ->evaluateJavaScript(beforeScript.join(""));

    if (result.toBool() == true) {
        evClose->accept();
    } else {
        evClose->ignore();
    }
}
