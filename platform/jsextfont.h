/****************************************************************************
**
** Copyright (C) 2010 Matsukei Co.,Ltd.
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

#ifndef JSEXTFONT_H
#define JSEXTFONT_H

#include <QWidget>

class JsExtFont : public QWidget
{
    Q_OBJECT
public:
    JsExtFont(QWidget *parent = 0);
    QStringList pureLatinFamilies;

private:
    void initPureLatinFamilies();

public slots:
    QStringList getFamilies();
    qreal getTightHeight(const QString &family,
                         const float &fontSize,
                         const bool &bold,
                         const QString &text);
    qreal getHeight(const QString &family,
                    const float &fontSize);
    bool isLatin(const QString &family);
};

#endif // JSEXTFONT_H
