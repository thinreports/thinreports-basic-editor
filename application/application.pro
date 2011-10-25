coreApps.source = core
coreApps.target = .
fontFiles.source = fonts
fontFiles.target = .
DEPLOYMENTFOLDERS = coreApps fontFiles

TARGET   = ThinReportsEditor
SOURCES += main.cpp

include(platform/platform.pri)
qtcAddDeployment()
