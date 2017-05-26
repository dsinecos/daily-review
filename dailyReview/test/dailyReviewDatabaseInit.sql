--Flush all the database tables
DELETE FROM public.dailyreview_score;
DELETE FROM public.dailyreview_journalresponse;

DELETE FROM public.dailyreview_userdate;

DELETE FROM public.dailyreview_journal;
DELETE FROM public.dailyreview_category;

DELETE FROM public.dailyreview_session;
DELETE FROM public.dailyreview_users;

--Setup the User list for the dailyreview app

INSERT INTO public.dailyreview_users(
            user_name, password)
    VALUES ('Bruce', 'Wayne');
INSERT INTO public.dailyreview_users(
            user_name, password)
    VALUES ('Baba', 'Ramdev');
INSERT INTO public.dailyreview_users(
            user_name, password)
    VALUES ('Jack', 'Sparrow');
INSERT INTO public.dailyreview_users(
            user_name, password)
    VALUES ('Black', 'Widow');
INSERT INTO public.dailyreview_users(
            user_name, password)
    VALUES ('Natasha', 'Romanoff');