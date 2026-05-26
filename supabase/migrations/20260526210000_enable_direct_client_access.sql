drop policy if exists "Public can submit inquiries" on public.inquiries;
create policy "Public can submit inquiries"
on public.inquiries
for insert
to anon, authenticated
with check (true);
