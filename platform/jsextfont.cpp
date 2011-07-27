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

#include "jsextfont.h"
#include <QFontDatabase>
#include <QStringList>
#include <QFont>
#include <QFontMetricsF>

JsExtFont::JsExtFont(QWidget *parent) :
    QWidget(parent)
{
    initPureLatinFamilies();
}

QStringList JsExtFont::getFamilies()
{
    QFontDatabase fontDB;
    return fontDB.families(QFontDatabase::Latin);
}

void JsExtFont::initPureLatinFamilies()
{
    QStringList families(getFamilies());
    QStringList removeFamilies;

    // remove target Language
    QFontDatabase fontDB;
    QStringList simpleChinese(fontDB.families(QFontDatabase::SimplifiedChinese));
    QStringList traditionalChinese(fontDB.families(QFontDatabase::TraditionalChinese));
    QStringList japanese(fontDB.families(QFontDatabase::Japanese));
    QStringList korean(fontDB.families(QFontDatabase::Korean));
    QStringList symbol(fontDB.families(QFontDatabase::Symbol));
    QStringList other(fontDB.families(QFontDatabase::Other));

    removeFamilies << simpleChinese << traditionalChinese
                   << japanese << korean << symbol << other;
    removeFamilies.removeDuplicates();

    foreach(QString f, removeFamilies){
        families.removeAll(f);
    }
    pureLatinFamilies = families;
}

qreal JsExtFont::getTightHeight(const QString &family,
                                const float &fontSize,
                                const bool &bold,
                                const QString &text)
{
    QFont font(family);
    font.setBold(bold);
    font.setPixelSize(fontSize);

    QFontMetricsF fm(font);
    QRectF bounds = fm.tightBoundingRect(text);
    return bounds.height();
}

qreal JsExtFont::getHeight(const QString &family,
                           const float &fontSize)
{
    QFont font(family);
    font.setPixelSize(fontSize);

    QFontMetricsF fm(font);
    qreal height = fm.height();
    return height - 1;
}

bool JsExtFont::isLatin(const QString &family)
{
    return -1 != pureLatinFamilies.indexOf(family);
}
