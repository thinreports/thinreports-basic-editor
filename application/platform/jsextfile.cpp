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

#include "jsextfile.h"
#include <QFile>
#include <QFileInfo>
#include <QFileDialog>
#include <QTextStream>
#ifndef Q_OS_MAC
#include <QRegExp>
#endif

JsExtFile::JsExtFile(QWidget *parent)
    : QWidget(parent)
{
}

bool JsExtFile::isFileExists(const QString &fileName)
{
    return QFile::exists(fileName);
}

bool JsExtFile::isFileWritable(const QString &fileName)
{
    if (isFileExists(fileName)) {
        QFileInfo fi(fileName);
        return fi.isWritable();
    }
    return false;
}

QString JsExtFile::getOpenFileName(const QString &title,
                                    const QString &dir,
                                    const QString &filter)
{
#ifdef Q_OS_MAC
    return QFileDialog::getOpenFileName(this,
                                        title.isEmpty() ? QString("Open file.") : title,
                                        dir.isEmpty() ? QDir::homePath() : dir,
                                        filter.isEmpty() ? QString("All files (*)") : filter);
#else
    return openFileDialog(QFileDialog::AcceptOpen, title, dir, filter);
#endif
}

QString JsExtFile::getTextFileContent(const QString &fileName)
{
    if (!fileName.isEmpty()) {
        QFile file(fileName);

        if (!file.open(QIODevice::ReadOnly | QIODevice::Text)) {
            return "";
        }

        QTextStream out(&file);
        out.setCodec("UTF-8");
        return out.readAll();
    }
    return "";
}

bool JsExtFile::saveFile(const QString &fileName,
                          const QString &content)
{
    QFile file(fileName);

    if (!file.open(QIODevice::WriteOnly | QIODevice::Text)) {
        return false;
    }

    QTextStream in(&file);
    in.setCodec("UTF-8");
    in << content;

    return true;
}

bool JsExtFile::saveFileAs(const QString &content,
                           const QString &title,
                           const QString &dir,
                           const QString &filter)
{
    QString fileName = getSaveFileName(title, dir, filter);

    if (!fileName.isEmpty()) {
        return saveFile(fileName, content);
    }
    return false;
}

QString JsExtFile::getSaveFileName(const QString &title,
                                   const QString &dir,
                                   const QString &filter)
{
#ifdef Q_OS_MAC
    return QFileDialog::getSaveFileName(this,
                                        title.isEmpty() ? QString("Save file.") : title,
                                        dir.isEmpty() ? QDir::homePath() : dir,
                                        filter.isEmpty() ? "All files (*)" : filter);
#else
    return openFileDialog(QFileDialog::AcceptSave, title, dir, filter);
#endif
}

QString JsExtFile::pathBaseName(const QString &path)
{
    QFileInfo fi(path);
    return fi.fileName();
}

QString JsExtFile::pathDirName(const QString &path)
{
    QFileInfo fi(path);
    return fi.absoluteDir().path();
}

QString JsExtFile::getFileSuffix(const QString &fileName)
{
    QFileInfo fi(fileName);
    return fi.suffix();
}

#ifndef Q_OS_MAC
QString JsExtFile::openFileDialog(const QFileDialog::AcceptMode &acceptMode,
                                  const QString &title,
                                  const QString &dir,
                                  const QString &filter)
{
    QFileDialog dialog(this, title.isEmpty() ? tr("Save file") : title);

    dialog.setAcceptMode(acceptMode);
    dialog.setViewMode(QFileDialog::Detail);
    dialog.setOption(QFileDialog::DontUseNativeDialog, true);

    if (acceptMode == QFileDialog::AcceptSave) {
        dialog.setDefaultSuffix(tr("tlf"));
    }
    if (!filter.isEmpty()) {
        dialog.setNameFilter(filter);
    }

    QDir defaultDir;
    QString defaultFilename;

    // when dir is empty string
    if (dir.isEmpty()) {
        defaultDir = QDir::home();
    } else {
        // when dir is File
        if (QRegExp("^.+\\.[a-z]+$").exactMatch(dir)) {
            defaultDir = QFileInfo(dir).dir();
            defaultFilename = pathBaseName(dir);
        // when dir is Directory
        } else {
            defaultDir = QDir(dir);
        }
        // when dir is not exists
        if (!defaultDir.exists()) {
            defaultDir = QDir::home();
        }
    }

    // Set default directory
    dialog.setDirectory(defaultDir);
    // Set default filename if defaultFilename is setted
    if (!defaultFilename.isEmpty()) {
        dialog.selectFile(defaultFilename);
    }

    if (dialog.exec()) {
        return dialog.selectedFiles().first();
    } else {
        return tr("");
    }
}
#endif
