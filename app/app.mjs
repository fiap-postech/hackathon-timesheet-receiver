import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({ region: process.env.AWS_LAMBDA_REGION });

export const handler = async (event) => {
    try {
        console.log(`Event: ${JSON.stringify(event)}`);

        const requestBody = JSON.parse(event.body);
        const employeeId = event.headers['x-employee-id'];
        const employeeEmail = event.headers['x-employee-email'];

        const messageBody = {
            ...requestBody,
            "employeeId": employeeId,
            "employeeEmail": employeeEmail
        };

        const messageBodyAsString = JSON.stringify(messageBody);
        console.log(`messageBody: ${messageBodyAsString}`);

        const sqsResponse = await sqsClient.send(new SendMessageCommand({
            QueueUrl: process.env.AWS_SQS_QUEUE_URL,
            MessageBody: messageBodyAsString
        }));

        console.log(`Message sent to SQS: ${JSON.stringify(sqsResponse)}`);

        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json"
          },
          body: {
            "message": "Solicitação realizada com sucesso, você receberá o relatório de registro de ponto em seu e-mail."
          }
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify("Error occurred"),
        };
    }
};