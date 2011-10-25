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

#ifndef PLATFORM_H
#define PLATFORM_H

#include <QtGui/QMainWindow>
#include <QtWebKit/QWebView>
#include "jsextfile.h"
#include "jsextfont.h"
#include "jsextimage.h"
#include "jsextstring.h"
#include "jsextwindow.h"

class Platform : public QMainWindow
{
    Q_OBJECT

private:
    QWebView *view;

    bool isDebugMode();
    void setup();
    QByteArray createUid();
    QString adjustPath(const QString &path);

public:
    Platform(QWidget *parent = 0);
    void boot(const QString core);

protected:
    void closeEvent(QCloseEvent *evClose);

protected slots:
    void init();
    void populateJavaScript();
    void openUrl(QUrl url);

public slots:
    void windowCloseRequested();
};

#endif // PLATFORM_H
