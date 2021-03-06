import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import mockTask = require('vsts-task-lib/mock-task');

const taskPath = path.join(__dirname, '..', 'jenkinsdownloadartifacts.js');
const tr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tr.setInput("serverEndpoint", "ID1");
tr.setInput("jobName", "myfreestyleproject")
tr.setInput("saveTo", "jenkinsArtifacts");
tr.setInput("filePath", "/");
tr.setInput("jenkinsBuild", "BuildNumber");
tr.setInput("propagatedArtifacts", "true");
tr.setInput("artifactProvider", "azureStorage");
tr.setInput("ConnectedServiceNameARM", "ARM1");
tr.setInput("storageAccountName", "storage1");
tr.setInput("containerName", "container1");
tr.setInput("commonVirtualPath", "");
tr.setInput("jenkinsBuildNumber", "20");
tr.setInput("itemPattern", "**");
tr.setInput("downloadCommitsAndWorkItems", "false");

process.env['ENDPOINT_URL_ID1'] = 'http://url';
process.env['ENDPOINT_AUTH_PARAMETER_connection1_username'] = 'dummyusername';
process.env['ENDPOINT_AUTH_PARAMETER_connection1_password'] = 'dummypassword';
process.env['ENDPOINT_DATA_ID1_acceptUntrustedCerts'] = 'true';

process.env['ENDPOINT_URL_ARM1'] = 'http://url';
process.env['ENDPOINT_AUTH_PARAMETER_connection1_serviceprincipalid'] = 'dummyid';
process.env['ENDPOINT_AUTH_PARAMETER_connection1_serviceprincipalkey'] = 'dummykey';
process.env['ENDPOINT_AUTH_PARAMETER_connection1_tenantid'] = 'dummyTenantid';
process.env['ENDPOINT_DATA_ARM1_environmentAuthorityUrl'] = 'dummyurl';
process.env['ENDPOINT_DATA_ARM1_activeDirectoryServiceEndpointResourceId'] = 'dummyResourceId';
process.env['ENDPOINT_DATA_ARM1_subscriptionId'] = 'dummySubscriptionId';

tr.registerMock("azure-arm-rest/azure-arm-storage", {
    StorageManagementClient: function (A, B) {
        return {
            storageAccounts: {
                get: function (A) {
                    return {
                        properties: {
                            primaryEndpoints: {
                                blob: "primaryBlobUrl"
                            }
                        },
                        id: "StorageAccountUrl"
                    }
                },
                listkeys: function (A, B, C) {
                    return ["accesskey1", "accessKey2"];
                }
            }
        }
    },
    StorageAccounts: {
        getResourceGroupNameFromUri: function (A) {
            return "storageAccountResouceGroupName";
        }
    }
});

tr.registerMock("azure-arm-rest/azure-arm-common", {
    ApplicationTokenCredentials: function(A,B,C,D,E,F,G) {
        return {};
    }
});

tr.registerMock("azure-blobstorage-artifactProvider/blobservice", {
    BlobService: function(A,B) {
        return {
            downloadBlobs: function(A,B,C,D) {
                return;
            }
        }
    }
});

tr.run();
