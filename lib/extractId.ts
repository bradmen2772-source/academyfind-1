export default function extractId(idSlug: string) : string {
    return idSlug.split("-")[0];
}