resources.source = resources
resources.target = .
DEPLOYMENTFOLDERS = resources

TARGET   = ThinReportsEditor
SOURCES += main.cpp

include(platform/platform.pri)
qtcAddDeployment()
