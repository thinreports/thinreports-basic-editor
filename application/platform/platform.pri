QT += webkitwidgets

TEMPLATE = app

SOURCES += $$PWD/platform.cpp \
           $$PWD/jsextfile.cpp \
           $$PWD/jsextfont.cpp \
           $$PWD/jsextimage.cpp \
           $$PWD/jsextstring.cpp \
           $$PWD/jsextwindow.cpp

HEADERS += $$PWD/platform.h \
           $$PWD/jsextfile.h \
           $$PWD/jsextfont.h \
           $$PWD/jsextimage.h \
           $$PWD/jsextstring.h \
           $$PWD/jsextwindow.h
INCLUDEPATH += $$PWD

defineTest(qtcAddDeployment) {
    MAINPROFILEPWD = $$PWD

    # Win32
    win32 {
        resourceRoot = $$OUT_PWD/resources
        copyCommand =
        for(deploymentfolder, DEPLOYMENTFOLDERS) {
            source = $$MAINPROFILEPWD/$$eval($${deploymentfolder}.source)
            source = $$replace(source, /, \\)
            target = $$resourceRoot/$$last($$split(source, \\))
            target = $$replace(target, /, \\)
            !isEqual(source, $$target) {
                !isEmpty(copyCommand):copyCommand += &&
                copyCommand += $(COPY_DIR) \"$$source\" \"$$target\"
            }
        }
    # Mac OSX
    } else:macx {
        copyCommand =
        for(deploymentfolder, DEPLOYMENTFOLDERS) {
            source = $$MAINPROFILEPWD/$$eval($${deploymentfolder}.source)/
            target = $$OUT_PWD/$${TARGET}.app/Contents/Resources/$$eval($${deploymentfolder}.target)
            !isEqual(source, $$target) {
                !isEmpty(copyCommand):copyCommand += &&
                copyCommand += $(MKDIR) \"$$target\"
                copyCommand += && $(COPY_DIR) \"$$source\" \"$$target\"
            }
        }
    # Ubuntu (Desktop Linux)
    } else {
        copyCommand =
        for(deploymentfolder, DEPLOYMENTFOLDERS) {
            source = $$MAINPROFILEPWD/$$eval($${deploymentfolder}.source)
            target = $$OUT_PWD
            !isEqual(source, $$target) {
                !isEmpty(copyCommand):copyCommand += &&
                copyCommand += $(MKDIR) \"$$target\"
                copyCommand += && $(COPY_DIR) \"$$source\" \"$$target\"
            }
        }
    }

    !isEmpty(copyCommand) {
        copyCommand = @echo Copying application data... && $$copyCommand
        copydeploymentfolders.commands = $$copyCommand
        first.depends = $(first) copydeploymentfolders
        export(first.depends)
        export(copydeploymentfolders.commands)
        QMAKE_EXTRA_TARGETS += first copydeploymentfolders
    }

    export (QMAKE_EXTRA_TARGETS)

# (TODO) The following codes are necessary?
#----------------------------------------------
#        installPrefix = /opt/$${TARGET}
#        for(deploymentfolder, DEPLOYMENTFOLDERS) {
#            item = item$${deploymentfolder}
#            itemfiles = $${item}.files
#            $$itemfiles = $$eval($${deploymentfolder}.source)
#            itempath = $${item}.path
#            $$itempath = $${installPrefix}/$$eval($${deploymentfolder}.target)
#            export($$itemfiles)
#            export($$itempath)
#            INSTALLS += $$item
#        }
#        !isEmpty(desktopfile.path) {
#            export(icon.files)
#            export(icon.path)
#            export(desktopfile.files)
#            export(desktopfile.path)
#            INSTALLS += icon desktopfile
#        }
#        target.path = $${installPrefix}/bin
#        export(target.path)
#        INSTALLS += target
#    }
#    export (ICON)
#    export (INSTALLS)
#    export (DEPLOYMENT)
#    export (LIBS)
}
