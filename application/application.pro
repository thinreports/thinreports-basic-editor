resources.source = resources
resources.target = .
DEPLOYMENTFOLDERS = resources

TARGET   = ThinreportsEditor
SOURCES += main.cpp

include(platform/platform.pri)
qtcAddDeployment()
