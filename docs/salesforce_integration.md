# Lab Gateway - Salesforce Integration

This document explains how to integrate the Lab Gateway API with Salesforce using Apex.

## 1. Create a Named Credential
1. In Salesforce Setup, search for **Named Credentials**.
2. Click **New Legacy Named Credential**.
3. Fill out the details:
   - **Label:** Lab Gateway
   - **Name:** `Lab_Gateway`
   - **URL:** `https://caresphere-lab-gateway.onrender.com` *(Replace with your actual Render URL)*
   - **Identity Type:** Named Principal
   - **Authentication Protocol:** No Authentication
4. Ensure **Allow Merge Fields in HTTP Header** and **HTTP Body** are checked.
5. Save the Credential.

## 2. Apex Integration Classes

### Authentication Utility
This class logs in and retrieves the JWT token.
```java
public class LabGatewayAuth {
    public static String login() {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:Lab_Gateway/api/v1/auth/login');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        
        String payload = '{"username":"salesforce_agent","password":"sfdcpassword123"}';
        req.setBody(payload);
        
        Http http = new Http();
        HttpResponse res = http.send(req);
        
        if (res.getStatusCode() == 200) {
            Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            return (String) result.get('token');
        } else {
            System.debug('Login failed: ' + res.getBody());
            return null;
        }
    }
}
```

### Lab Results Service
This service fetches the lab results for a patient.
```java
public class LabResultsService {
    public static void fetchPatientLabs(String patientId) {
        String token = LabGatewayAuth.login();
        if (token == null) return;
        
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:Lab_Gateway/api/v1/labs/results/' + patientId);
        req.setMethod('GET');
        req.setHeader('Authorization', 'Bearer ' + token);
        
        Http http = new Http();
        HttpResponse res = http.send(req);
        
        if (res.getStatusCode() == 200) {
            System.debug('Lab Results: ' + res.getBody());
        } else {
            System.debug('Error fetching labs: ' + res.getBody());
        }
    }
}
```

### Queueable Interface (Async Processing)
For triggering callouts from standard Triggers or Flows.
```java
public class FetchLabsQueueable implements Queueable, Database.AllowsCallouts {
    private String patientId;
    
    public FetchLabsQueueable(String patientId) {
        this.patientId = patientId;
    }
    
    public void execute(QueueableContext context) {
        LabResultsService.fetchPatientLabs(patientId);
    }
}
```

## 3. Testing
Open the Developer Console -> Execute Anonymous Window:
```java
// Testing the queueable for Patient ID PAT12345
System.enqueueJob(new FetchLabsQueueable('PAT12345'));
```
