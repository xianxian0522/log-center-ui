library 'sslib@master' //引用此工程，格式为<工程名>@<branchName>。此工程会配置在Jenkins中，sslib为Jenkins中配置的工程名，master为branch或tag名。

def jobInfo = [
    nodeName: "centos7_node16_python36", //指定在哪个Jenkins节点上执行
    projName: "devops",//项目名称
    name: "log-center-ui",//工程名称
    deployInput:"",//可选，空为分步操作，不空为一键操作，仅限salt
    packageInfo: [
        packageShell: "build.sh",
        archiveFiles: "*.tar.gz", //可选，存档的包文件，可用通配符，默认为*.tar.gz
    ],
    releaseInfo: [
        skip: true,
        serverName: "artifactory",
        packages: [
            [
                fileName: "*.tar.gz",
                repoName: "generic-release",
            ]
        ]
    ]
]

building.buildCustomProject(jobInfo) //根据给定的信息执行Pipeline
